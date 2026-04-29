import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface ProcessingAgent {
  name: string;
  label: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent implements OnInit {
  data: any[] = [];
  isLoading = false;
  private isLoadingInProgress = false;

  processingAgents: ProcessingAgent[] = [
    { name: 'analyzer', label: 'Checking prescriptions…', completed: false, active: false },
    { name: 'scheduler', label: 'Setting reminders…', completed: false, active: false },
    { name: 'translator', label: 'Localizing info…', completed: false, active: false },
    { name: 'generator', label: 'Generating response…', completed: false, active: false }
  ];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadMedicineData();
  }

  private loadMedicineData() {
    // Prevent double-click/rapid re-submissions
    if (this.isLoadingInProgress) {
      return;
    }

    this.isLoadingInProgress = true;
    this.isLoading = true;
    this.resetProcessingAgents();
    this.simulateAgentProcessing();

    this.api.medicine().subscribe(
      (res) => {
        this.data = Array.isArray(res) ? res : [res];
        // Mark 4th step as completed when response arrives
        this.processingAgents[3].completed = true;
        this.processingAgents[3].active = false;
        // Small delay for visual feedback before hiding loader
        setTimeout(() => {
          this.isLoading = false;
          this.isLoadingInProgress = false;
        }, 300);
      },
      (error) => {
        console.error('Error loading medicine data:', error);
        this.data = [];
        this.processingAgents[3].completed = true;
        this.processingAgents[3].active = false;
        setTimeout(() => {
          this.isLoading = false;
          this.isLoadingInProgress = false;
        }, 300);
      }
    );
  }

  private resetProcessingAgents() {
    this.processingAgents.forEach(agent => {
      agent.completed = false;
      agent.active = false;
    });
  }

  private simulateAgentProcessing() {
    // Analyzer Agent - 0-600ms
    setTimeout(() => {
      this.processingAgents[0].active = true;
    }, 0);

    setTimeout(() => {
      this.processingAgents[0].completed = true;
      this.processingAgents[0].active = false;
      // Scheduler Agent - 600-1200ms
      this.processingAgents[1].active = true;
    }, 600);

    setTimeout(() => {
      this.processingAgents[1].completed = true;
      this.processingAgents[1].active = false;
      // Translator Agent - 1200-1800ms
      this.processingAgents[2].active = true;
    }, 1200);

    setTimeout(() => {
      this.processingAgents[2].completed = true;
      this.processingAgents[2].active = false;
      // Response Generator Agent - 1800ms onwards
      this.processingAgents[3].active = true;
    }, 1800);
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  objectEntries(value: Record<string, any>): { key: string; value: any }[] {
    return Object.entries(value || {}).map(([key, entryValue]) => ({ key, value: entryValue }));
  }

  formatKey(key: string): string {
    return key.split('_').join(' ');
  }

  getPrimaryText(item: any): string {
    if (!this.isObject(item)) {
      return String(item || 'Medicine reminder');
    }

    return item.title || item.name || item.medicine || item.reminder || item.message || 'Medicine reminder';
  }

  getSecondaryText(item: any): string {
    if (!this.isObject(item)) {
      return 'Daily care reminder';
    }

    return item.subtitle || item.description || item.note || item.advice || item.time || item.frequency || 'Stay on track with today\'s care plan';
  }

  getAccentText(item: any): string {
    if (!this.isObject(item)) {
      return 'Today';
    }

    return item.time || item.when || item.schedule || item.dosage || item.status || 'Today';
  }
}
