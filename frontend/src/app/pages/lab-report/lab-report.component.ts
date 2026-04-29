import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface ProcessingAgent {
  name: string;
  label: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-lab-report',
  template: `
    <section class="premium-page lab-report-theme">
      <div class="hero-panel">
        <div class="hero-illustration" aria-hidden="true">
          <img src="assets/pregnant-woman-background-maternity-vector-illustration_543785-13.avif" class="hero-mascot" alt="Pregnant woman maternity illustration">
        </div>
        <div class="hero-copy">
          <span class="hero-kicker">Health records</span>
          <h1>Lab reports</h1>
          <p>Upload your latest blood tests, ultrasound scans, or lab documents and keep them ready for your care team.</p>
        </div>
      </div>

      <div class="premium-grid lab-report-grid">
        <article class="feature-card upload-card">
          <div class="feature-header">
            <div>
              <div class="feature-eyebrow">Upload report</div>
              <h2>Submit a new lab report</h2>
              <p>Select a PDF or image file and upload it securely for your session.</p>
            </div>
          </div>

          <div class="upload-body">
            <label class="file-input-label">
              <input type="file" accept=".pdf,image/*" (change)="onFileChange($event)" />
              <span>{{ selectedFile ? selectedFile.name : 'Choose PDF or image' }}</span>
            </label>

            <button type="button" class="primary-button" [disabled]="uploading || !selectedFile" (click)="uploadReport()">
              {{ uploading ? 'Uploading...' : 'Upload report' }}
            </button>

            <div *ngIf="uploadError" class="form-error">{{ uploadError }}</div>
            <div *ngIf="uploadSuccess" class="form-success">{{ uploadSuccess }}</div>
          </div>

          <div *ngIf="uploading" class="loading-container">
            <div class="loading-header">
              <span class="loading-title">Processing lab report...</span>
            </div>

            <div class="agents-processing">
              <div *ngFor="let agent of processingAgents" class="agent-step" [ngClass]="{'active': agent.active, 'completed': agent.completed}">
                <div class="agent-status">
                  <span *ngIf="agent.completed" class="status-icon completed">✓</span>
                  <span *ngIf="!agent.completed && agent.active" class="status-icon active">
                    <span class="spinner"></span>
                  </span>
                  <span *ngIf="!agent.completed && !agent.active" class="status-icon pending">○</span>
                </div>
                <span class="agent-label">{{ agent.label }}</span>
              </div>
            </div>
          </div>

          <div *ngIf="latestSuggestion" class="suggestion-panel">
            <div class="feature-eyebrow">AI suggestion</div>
            <h3>Lab report guidance</h3>
            <p>{{ latestSuggestion | multilineText }}</p>
          </div>
        </article>

        <article class="feature-card reports-card">
          <div class="feature-header">
            <div>
              <div class="feature-eyebrow">Recent reports</div>
              <h2>Latest laboratory files</h2>
            </div>
          </div>

          <div *ngIf="isLoading" class="loading-panel">
            <p>Loading lab reports...</p>
          </div>

          <div *ngIf="!isLoading && data.length; else noLabReports" class="report-list">
            <article *ngFor="let report of data" class="report-item">
              <div>
                <strong>{{ getReportTitle(report) | multilineText }}</strong>
                <span>{{ getReportSubtitle(report) | multilineText }}</span>
              </div>
              <a [href]="getReportUrl(report)" target="_blank" rel="noreferrer" class="report-link">View</a>
            </article>
          </div>

          <ng-template #noLabReports>
            <div class="empty-panel">
              <h2>No lab reports yet</h2>
              <p>Upload a document to keep your reports ready for review.</p>
            </div>
          </ng-template>
        </article>
      </div>
    </section>
  `,
  styleUrls: ['./lab-report.component.css']
})
export class LabReportComponent implements OnInit {
  data: any[] = [];
  isLoading = false;
  uploading = false;
  selectedFile: File | null = null;
  uploadError = '';
  uploadSuccess = '';
  latestSuggestion = '';
  sessionId = localStorage.getItem('session_id') || '';
  private uploadInProgress = false;

  processingAgents: ProcessingAgent[] = [
    { name: 'reader', label: 'Reading lab file...', completed: false, active: false },
    { name: 'analyzer', label: 'Analyzing report values...', completed: false, active: false },
    { name: 'advisor', label: 'Generating suggestions...', completed: false, active: false }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadLabReports();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadError = '';
    this.uploadSuccess = '';
    this.selectedFile = input.files && input.files.length ? input.files[0] : null;
  }

  uploadReport(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please choose a PDF or image before uploading.';
      return;
    }

    if (!this.sessionId) {
      this.uploadError = 'Unable to upload report: session is missing.';
      return;
    }

    this.uploadError = '';
    this.uploadSuccess = '';
    this.latestSuggestion = '';
    this.uploading = true;
    this.uploadInProgress = true;
    this.resetProcessingAgents();
    this.simulateUploadProcessing();

    const form = new FormData();
    form.append('file', this.selectedFile);
    form.append('session_id', this.sessionId);

    this.api.uploadLabReport(form).subscribe(
      (res: any) => {
        this.uploadSuccess = 'Lab report uploaded successfully.';
        this.latestSuggestion = this.extractSuggestion(res);
        this.selectedFile = null;
        this.finishUploadProcessing();
        this.loadLabReports();
      },
      (error) => {
        console.error('Lab report upload failed:', error);
        this.uploadError = 'Upload failed. Please try again.';
        this.finishUploadProcessing();
      }
    );
  }

  loadLabReports(): void {
    if (!this.sessionId) {
      this.data = [];
      return;
    }

    this.isLoading = true;
    this.api.getLabReports().subscribe(
      (res: any) => {
        const reports = Array.isArray(res?.reports)
          ? res.reports
          : Array.isArray(res)
          ? res
          : [];

        this.data = reports;
        this.isLoading = false;
      },
      (error) => {
        console.error('Could not fetch lab reports:', error);
        this.data = [];
        this.isLoading = false;
      }
    );
  }

  getReportTitle(report: any): string {
    return report?.title || report?.filename || report?.name || 'Lab report';
  }

  getReportSubtitle(report: any): string {
    if (report?.created_at) {
      return new Date(report.created_at).toLocaleDateString();
    }
    if (report?.uploaded_at) {
      return new Date(report.uploaded_at).toLocaleDateString();
    }
    return report?.type || 'PDF / image';
  }

  getReportUrl(report: any): string {
    return report?.url || report?.file_url || report?.download_url || '#';
  }

  private resetProcessingAgents(): void {
    this.processingAgents.forEach(agent => {
      agent.completed = false;
      agent.active = false;
    });
  }

  private simulateUploadProcessing(): void {
    setTimeout(() => {
      if (this.uploadInProgress) {
        this.processingAgents[0].active = true;
      }
    }, 0);

    setTimeout(() => {
      if (this.uploadInProgress) {
        this.processingAgents[0].completed = true;
        this.processingAgents[0].active = false;
        this.processingAgents[1].active = true;
      }
    }, 700);

    setTimeout(() => {
      if (this.uploadInProgress) {
        this.processingAgents[1].completed = true;
        this.processingAgents[1].active = false;
        this.processingAgents[2].active = true;
      }
    }, 1500);
  }

  private finishUploadProcessing(): void {
    this.uploadInProgress = false;
    this.processingAgents.forEach(agent => {
      agent.completed = true;
      agent.active = false;
    });

    setTimeout(() => {
      this.uploading = false;
    }, 300);
  }

  private extractSuggestion(res: any): string {
    const candidates = [
      res?.suggestion,
      res?.report_suggestion,
      res?.detailed_report,
      res?.detailedReport,
      res?.analysis,
      res?.summary,
      res?.response,
      res?.message,
      res?.data?.suggestion,
      res?.data?.report_suggestion,
      res?.data?.detailed_report,
      res?.data?.detailedReport,
      res?.data?.analysis,
      res?.data?.summary,
      res?.data?.response,
      res?.data?.message
    ];

    for (const candidate of candidates) {
      const text = this.stringifySuggestion(candidate);
      if (text) {
        return text;
      }
    }

    return '';
  }

  private stringifySuggestion(value: any): string {
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
        .map(item => this.stringifySuggestion(item))
        .filter(Boolean)
        .join('\n')
        .trim();
    }

    if (typeof value === 'object') {
      const preferred = [
        value?.text,
        value?.message,
        value?.summary,
        value?.analysis,
        value?.description,
        value?.recommendation
      ];

      for (const candidate of preferred) {
        const text = this.stringifySuggestion(candidate);
        if (text) {
          return text;
        }
      }

      return Object.entries(value)
        .map(([key, entryValue]) => `${this.formatKey(key)}: ${this.stringifySuggestion(entryValue)}`)
        .filter(line => !line.endsWith(': '))
        .join('\n')
        .trim();
    }

    return '';
  }

  formatKey(key: string): string {
    return key.split('_').join(' ');
  }
}
