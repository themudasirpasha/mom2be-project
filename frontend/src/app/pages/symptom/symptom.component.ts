import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface SymptomSection {
  heading: string;
  lines: string[];
}

type RiskClass = 'risk-high' | 'risk-medium' | 'risk-low' | '';

interface StaticSymptomResponse {
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  response: string;
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
  isLoading = false;
  private activeRequestId = 0;
  suggestions = [
    'I have a severe headache and feel dizzy.',
    'My feet are swelling and I feel tired.',
    'I have lower back pain and mild abdominal discomfort.',
    'I feel nauseous in the morning and cannot eat much.',
    'My baby is moving less than usual today.'
  ];
  private staticSuggestionResponses: Record<string, StaticSymptomResponse> = {
    'I have a severe headache and feel dizzy.': {
      risk: 'HIGH',
      response: `You may need urgent review because severe headache with dizziness can be linked to high blood pressure in pregnancy.

1. **Immediate guidance:**
* Sit or lie down safely and avoid sudden movement.
* Drink water if you have not had enough fluids today.
* Ask a family member to stay nearby.

2. **When to seek care now:**
* If you also have blurred vision, swelling of face, chest pain, or severe vomiting.
* If the headache is not settling after rest.

3. **Next step:**
Please contact your doctor, nurse, or nearby hospital as soon as possible today.`
    },
    'My feet are swelling and I feel tired.': {
      risk: 'MEDIUM',
      response: `This can happen in pregnancy, but it should still be monitored carefully.

1. **Helpful care at home:**
* Rest with your feet raised for some time.
* Drink enough water through the day.
* Avoid standing for very long periods.

2. **Watch for warning signs:**
* Swelling in the face or hands.
* Headache, blurred vision, or sudden increase in swelling.

3. **Next step:**
If the swelling is new, getting worse, or comes with headache or vision changes, please speak with your care team soon.`
    },
    'I have lower back pain and mild abdominal discomfort.': {
      risk: 'LOW',
      response: `Mild lower back pain and abdominal discomfort can be common as the body changes in pregnancy.

1. **Comfort measures:**
* Rest on your side and avoid lifting heavy items.
* Use a pillow for lower-back support.
* Drink water and eat light meals.

2. **Keep watching symptoms:**
* Track whether the pain becomes rhythmic or stronger.
* Notice any bleeding, leaking fluid, or reduced baby movement.

3. **Next step:**
If pain becomes strong, frequent, or is associated with bleeding or fever, seek medical care promptly.`
    },
    'I feel nauseous in the morning and cannot eat much.': {
      risk: 'LOW',
      response: `Morning nausea is common in pregnancy, especially in the first months.

1. **What may help:**
* Eat small snacks instead of large meals.
* Keep plain biscuits or dry toast nearby.
* Sip water, lemon water, or ORS slowly.

2. **Call for help sooner if:**
* You are vomiting many times a day.
* You cannot keep fluids down.
* You feel weak, dizzy, or notice very little urine.

3. **Next step:**
Try frequent small meals today. If vomiting is severe or you cannot drink fluids, talk to your doctor.`
    },
    'My baby is moving less than usual today.': {
      risk: 'HIGH',
      response: `Reduced baby movement should be taken seriously, especially if it feels clearly different from your usual pattern.

1. **Check right away:**
* Sit quietly on your left side.
* Drink water and focus on movements for the next 1 to 2 hours.

2. **Go to care urgently if:**
* Movements remain less than usual.
* You notice pain, bleeding, or leaking fluid.

3. **Next step:**
Please contact your hospital or maternity care provider today for urgent advice if movements do not improve soon.`
    }
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  applySuggestion(suggestion: string): void {
    this.text = suggestion;
    this.runSymptomCheck(suggestion);
  }

  check() {
    const trimmedText = this.text.trim();
    if (!trimmedText) {
      return;
    }

    this.runSymptomCheck(trimmedText);
  }

  private runSymptomCheck(text: string): void {
    const trimmedText = text.trim();
    const staticResponse = this.staticSuggestionResponses[trimmedText];
    const requestId = ++this.activeRequestId;

    this.isLoading = false;

    if (staticResponse) {
      this.result = staticResponse;
      this.parseResponse(staticResponse);
      return;
    }

    this.isLoading = true;
    this.result = null;
    this.introLines = [];
    this.sections = [];

    this.api.symptom(trimmedText).subscribe({
      next: (res: any) => {
        if (requestId !== this.activeRequestId) {
          return;
        }

        this.result = res;
        this.parseResponse(res);
        this.isLoading = false;
      },
      error: () => {
        if (requestId !== this.activeRequestId) {
          return;
        }

        this.result = {
          risk: '',
          message: 'Unable to analyze symptoms right now. Please try again.'
        };
        this.parseResponse(this.result);
        this.isLoading = false;
      }
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

  getRiskClass(): RiskClass {
    const risk = String(this.result?.risk || '').toUpperCase();

    if (risk === 'HIGH') {
      return 'risk-high';
    }

    if (risk === 'MEDIUM') {
      return 'risk-medium';
    }

    if (risk === 'LOW') {
      return 'risk-low';
    }

    return '';
  }

  getRiskLabel(): string {
    const risk = String(this.result?.risk || '').toUpperCase();

    if (risk === 'HIGH' || risk === 'MEDIUM' || risk === 'LOW') {
      return risk;
    }

    return 'RESULT';
  }

  getRiskIcon(): string {
    const risk = String(this.result?.risk || '').toUpperCase();

    if (risk === 'HIGH') {
      return '!';
    }

    if (risk === 'MEDIUM') {
      return '~';
    }

    if (risk === 'LOW') {
      return '+';
    }

    return '*';
  }
}
