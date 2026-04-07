import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface SymptomSection {
  heading: string;
  lines: string[];
}

@Component({
  selector: 'app-symptom',
  templateUrl: './symptom.component.html',
  styleUrls: ['./symptom.component.css']
})
export class SymptomComponent implements OnInit {
  text = '';
  result: any;
  sections: SymptomSection[] = [];
  introLines: string[] = [];
  suggestions = [
    'I have a severe headache and feel dizzy.',
    'My feet are swelling and I feel tired.',
    'I have lower back pain and mild abdominal discomfort.'
  ];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  applySuggestion(suggestion: string): void {
    this.text = suggestion;
  }

  check() {
    this.api.symptom(this.text).subscribe((res: any) => {
      this.result = res;
      this.parseResponse(res);
    });
  }

  private parseResponse(res: any): void {
    const responseText = this.extractResponseText(res);

    if (!responseText) {
      this.introLines = [];
      this.sections = [];
      return;
    }

    const normalized = responseText.replace(/\r\n/g, '\n').trim();
    const rawSections = normalized.split(/\n(?=\d+\.\s+\*\*.*?\*\*:)/g);

    if (rawSections.length === 1) {
      this.introLines = normalized.split('\n').map((line: string) => line.trim()).filter(Boolean);
      this.sections = [];
      return;
    }

    this.introLines = rawSections
      .shift()!
      .split('\n')
      .map((line: string) => line.trim())
      .filter(Boolean);

    this.sections = rawSections
      .map((block: string) => this.mapSection(block))
      .filter((section: SymptomSection | null): section is SymptomSection => !!section);
  }

  private mapSection(block: string): SymptomSection | null {
    const lines = block.split('\n').map((line: string) => line.trim()).filter(Boolean);

    if (!lines.length) {
      return null;
    }

    const heading = lines[0]
      .replace(/^\d+\.\s*/, '')
      .replace(/\*\*/g, '')
      .replace(/:$/, '');

    return {
      heading,
      lines: lines.slice(1)
    };
  }

  private extractResponseText(res: any): string {
    if (typeof res === 'string') {
      return res;
    }

    return res?.response || res?.message || res?.advice || '';
  }

  isBullet(line: string): boolean {
    return line.startsWith('*') || line.startsWith('-');
  }

  cleanLine(line: string): string {
    return line.replace(/^[*-]\s*/, '').trim();
  }

  getRiskClass(): string {
    const risk = String(this.result?.risk || '').toUpperCase();

    if (risk === 'HIGH') {
      return 'text-danger';
    }

    if (risk === 'MEDIUM') {
      return 'text-warning';
    }

    if (risk === 'LOW') {
      return 'text-success';
    }

    return '';
  }
}
