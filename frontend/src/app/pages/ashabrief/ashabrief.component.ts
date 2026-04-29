import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface ProcessingAgent {
  name: string;
  label: string;
  completed: boolean;
  active: boolean;
}

interface BriefSection {
  title: string;
  body: string;
}

@Component({
  selector: 'app-asha-brief',
  templateUrl: './ashabrief.component.html',
  styleUrls: ['./ashabrief.component.css']
})
export class AshaBriefComponent implements OnInit {
  message = '';
  isProcessing = false;
  isListening = false;
  voiceSupported = false;
  voiceStatus = '';
  recognition: any;
  briefText = '';
  briefSections: BriefSection[] = [];
  requestError = '';
  lastUpdated = '';

  suggestionPrompts = [
    'Prepare a home-visit brief for this mother with the most important follow-ups.',
    'Summarize nutrition, supplements, and danger signs to review this week.',
    'Create an ASHA handoff note with support contacts and next actions.'
  ];

  processingAgents: ProcessingAgent[] = [
    { name: 'profile', label: 'Reviewing pregnancy profile...', completed: false, active: false },
    { name: 'timeline', label: 'Checking current week and care timing...', completed: false, active: false },
    { name: 'briefing', label: 'Drafting ASHA visit notes...', completed: false, active: false }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    const SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition'];
    if (!SpeechRecognition) {
      this.voiceSupported = false;
      this.voiceStatus = 'Voice input is not available on this device.';
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = this.getSpeechLocale();

    this.recognition.onstart = () => {
      this.isListening = true;
      this.voiceStatus = 'Listening... tap again to stop recording.';
    };

    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ')
        .trim();

      if (transcript) {
        this.message = transcript;
      }
    };

    this.recognition.onerror = () => {
      this.voiceStatus = 'Voice input could not be completed. Tap the mic to try again.';
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.voiceStatus = this.message.trim()
        ? 'Recording stopped. Tap the mic to speak again.'
        : 'Recording stopped. Tap the mic to try again.';
    };

    this.voiceSupported = true;
    this.voiceStatus = 'Tap the mic and speak.';
  }

  toggleVoiceInput(): void {
    if (!this.voiceSupported || this.isProcessing) {
      return;
    }

    if (this.isListening) {
      this.recognition?.stop();
      this.voiceStatus = 'Stopping voice recording...';
      return;
    }

    this.recognition.lang = this.getSpeechLocale();

    try {
      this.isListening = true;
      this.voiceStatus = 'Listening... tap again to stop recording.';
      this.recognition?.start();
    } catch {
      this.isListening = false;
      this.voiceStatus = 'Voice input could not be started. Tap the mic to try again.';
    }
  }

  usePrompt(prompt: string): void {
    if (this.isProcessing) {
      return;
    }

    this.message = prompt;
  }

  send(): void {
    const userMessage = this.message.trim();
    if (!userMessage) {
      return;
    }

    this.isProcessing = true;
    this.requestError = '';
    this.resetProcessingAgents();
    this.simulateAgentProcessing();

    this.api.ashaBrief(userMessage).subscribe(
      (res: any) => {
        this.briefText = this.extractBriefText(res);
        this.briefSections = this.buildBriefSections(this.briefText);
        this.lastUpdated = this.getFormattedTime();
        this.isProcessing = false;
      },
      (error) => {
        console.error('ASHA brief error:', error);
        this.requestError = 'Unable to generate the ASHA brief right now. Please try again.';
        this.isProcessing = false;
      }
    );
  }

  getMotherName(): string {
    return localStorage.getItem('mother_name') || 'Amma';
  }

  getLanguage(): string {
    return localStorage.getItem('language') || 'english';
  }

  getWeek(): number | null {
    const week = Number(sessionStorage.getItem('week') || 0);
    return Number.isFinite(week) && week > 0 ? week : null;
  }

  hasBrief(): boolean {
    return this.briefSections.length > 0 || !!this.briefText;
  }

  private getFormattedTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private resetProcessingAgents(): void {
    this.processingAgents.forEach(agent => {
      agent.completed = false;
      agent.active = false;
    });
  }

  private simulateAgentProcessing(): void {
    setTimeout(() => {
      this.processingAgents[0].active = true;
    }, 0);

    setTimeout(() => {
      this.processingAgents[0].completed = true;
      this.processingAgents[0].active = false;
      this.processingAgents[1].active = true;
    }, 800);

    setTimeout(() => {
      this.processingAgents[1].completed = true;
      this.processingAgents[1].active = false;
      this.processingAgents[2].active = true;
    }, 1600);

    setTimeout(() => {
      this.processingAgents[2].completed = true;
      this.processingAgents[2].active = false;
    }, 2400);
  }

  private extractBriefText(res: any): string {
    const candidates = [
      res?.brief,
      res?.response,
      res?.reply,
      res?.message,
      res?.summary,
      res?.data?.brief,
      res?.data?.response,
      res?.data?.message
    ];

    for (const candidate of candidates) {
      const normalized = this.normalizeValue(candidate);
      if (normalized) {
        return normalized;
      }
    }

    return this.normalizeValue(res) || 'No briefing details were returned.';
  }

  private buildBriefSections(text: string): BriefSection[] {
    const normalized = String(text || '').replace(/\r/g, '').trim();
    if (!normalized) {
      return [];
    }

    const paragraphBlocks = normalized
      .split(/\n\s*\n/)
      .map(block => block.trim())
      .filter(Boolean);

    if (paragraphBlocks.length > 1) {
      return paragraphBlocks.map((block, index) => {
        const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
        const firstLine = lines[0] || '';

        if (firstLine.endsWith(':') && lines.length > 1) {
          return {
            title: firstLine.slice(0, -1),
            body: lines.slice(1).join('\n')
          };
        }

        return {
          title: index === 0 ? 'Overview' : `Note ${index + 1}`,
          body: block
        };
      });
    }

    const lineSections = normalized
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((line, index) => ({
        title: index === 0 ? 'Overview' : `Point ${index}`,
        body: line.replace(/^[-*]\s*/, '')
      }));

    return lineSections.length ? lineSections : [{ title: 'Overview', body: normalized }];
  }

  private normalizeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value
        .map(item => this.normalizeValue(item))
        .filter(Boolean)
        .join('\n');
    }

    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([key, entryValue]) => `${this.formatLabel(key)}: ${this.normalizeValue(entryValue)}`)
        .filter(Boolean)
        .join('\n');
    }

    return '';
  }

  private formatLabel(value: string): string {
    return value
      .split('_')
      .join(' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private getSpeechLocale(): string {
    const language = String(localStorage.getItem('language') || 'english').toLowerCase();

    if (language.includes('kannada')) {
      return 'kn-IN';
    }

    if (language.includes('hindi')) {
      return 'hi-IN';
    }

    if (language.includes('urdu')) {
      return 'ur-IN';
    }

    return 'en-IN';
  }
}
