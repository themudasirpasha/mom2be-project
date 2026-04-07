import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent implements OnInit {
  data: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.medicine().subscribe(res => this.data = Array.isArray(res) ? res : [res]);
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
