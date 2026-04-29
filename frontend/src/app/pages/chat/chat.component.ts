import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface ProcessingAgent {
  name: string;
  label: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: any[] = [];
  message = '';
  isProcessing = false;
  isListening = false;
  voiceSupported = false;
  voiceStatus = '';
  recognition: any;
  botName = 'Amma';
  
  processingAgents: ProcessingAgent[] = [
    { name: 'analyzer', label: 'Analyzing symptoms...', completed: false, active: false },
    { name: 'schemes', label: 'Checking schemes...', completed: false, active: false },
    { name: 'translator', label: 'Translating response...', completed: false, active: false }
  ];

  constructor(private api: ApiService) { }

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

  send() {
    if (!this.message.trim()) return;
    
    this.messages.push({
      type: 'user',
      text: this.message,
      time: this.getFormattedTime()
    });
    this.isProcessing = true;
    this.resetProcessingAgents();
    
    const userMessage = this.message;
    this.message = '';

    this.simulateAgentProcessing();

    this.api.chat(userMessage).subscribe(
      (res: any) => {
        this.messages.push({
          type: 'bot',
          sender: this.botName,
          text: res?.response || res?.reply || res?.message || 'Unable to process your request.',
          time: this.getFormattedTime(),
          agentsUsed: this.processingAgents.filter(a => a.completed)
        });
        this.isProcessing = false;
      },
      (error) => {
        this.messages.push({
          type: 'bot',
          sender: this.botName,
          text: 'Sorry, I encountered an error. Please try again.',
          time: this.getFormattedTime(),
          isError: true
        });
        this.isProcessing = false;
      }
    );
  }

  private getFormattedTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private resetProcessingAgents() {
    this.processingAgents.forEach(agent => {
      agent.completed = false;
      agent.active = false;
    });
  }

  private simulateAgentProcessing() {
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
