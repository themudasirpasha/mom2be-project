import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface ProcessingAgent {
  name: string;
  label: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-profile',
  template: `
    <section class="profile-page">
      <div class="profile-hero">
        <div>
          <span class="hero-kicker">Profile</span>
          <h1>{{ getProfileName() }}</h1>
          <p>Your pregnancy profile, support details, and important personal information in one calm place.</p>
        </div>
        <div class="hero-avatar">Profile</div>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <div class="loading-header">
          <span class="loading-title">Loading profile...</span>
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

      <div *ngIf="!isLoading && profile; else emptyProfile" class="profile-grid">
        <article *ngFor="let entry of objectEntries(profile)" class="profile-card">
          <span class="profile-key">{{ formatKey(entry.key) }}</span>
          <div class="profile-value">{{ entry.value }}</div>
        </article>
      </div>

      <ng-template #emptyProfile>
        <div *ngIf="!isLoading" class="empty-panel">Profile details will appear here after the profile API responds.</div>
      </ng-template>
    </section>
  `,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Record<string, any> | null = null;
  isLoading = false;

  processingAgents: ProcessingAgent[] = [
    { name: 'profile', label: 'Fetching profile...', completed: false, active: false },
    { name: 'support', label: 'Loading support details...', completed: false, active: false },
    { name: 'ready', label: 'Preparing your profile view...', completed: false, active: false }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.resetProcessingAgents();
    this.simulateAgentProcessing();

    this.api.getProfile().subscribe(
      (res: any) => {
        this.profile = res?.profile || res || null;
        this.finishLoading();
      },
      () => {
        this.profile = null;
        this.finishLoading();
      }
    );
  }

  objectEntries(value: Record<string, any> | null | undefined): { key: string; value: any }[] {
    return Object.entries(value || {}).map(([key, entryValue]) => ({ key, value: entryValue }));
  }

  formatKey(key: string): string {
    return key.split('_').join(' ');
  }

  getProfileName(): string {
    return this.profile?.['mother_name'] || this.profile?.['name'] || localStorage.getItem('mother_name') || 'Amma';
  }

  private resetProcessingAgents(): void {
    this.processingAgents.forEach(agent => {
      agent.completed = false;
      agent.active = false;
    });
  }

  private simulateAgentProcessing(): void {
    setTimeout(() => {
      if (this.isLoading) {
        this.processingAgents[0].active = true;
      }
    }, 0);

    setTimeout(() => {
      if (this.isLoading) {
        this.processingAgents[0].completed = true;
        this.processingAgents[0].active = false;
        this.processingAgents[1].active = true;
      }
    }, 700);

    setTimeout(() => {
      if (this.isLoading) {
        this.processingAgents[1].completed = true;
        this.processingAgents[1].active = false;
        this.processingAgents[2].active = true;
      }
    }, 1400);
  }

  private finishLoading(): void {
    this.processingAgents.forEach(agent => {
      agent.completed = true;
      agent.active = false;
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 250);
  }
}
