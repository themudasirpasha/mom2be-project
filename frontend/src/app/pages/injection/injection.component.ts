import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-injection',
  templateUrl: './injection.component.html',
  styleUrls: ['./injection.component.css']
})
export class InjectionComponent implements OnInit {
  data: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.injection().subscribe(res => this.data = Array.isArray(res) ? res : [res]);
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
      return String(item || 'Injection reminder');
    }

    return item.title || item.name || item.vaccine || item.injection || item.reminder || 'Injection reminder';
  }

  getSecondaryText(item: any): string {
    if (!this.isObject(item)) {
      return 'Upcoming pregnancy protection';
    }

    return item.description || item.note || item.advice || item.date || item.message || 'Important protection for your pregnancy timeline';
  }

  getAccentText(item: any): string {
    if (!this.isObject(item)) {
      return 'Upcoming';
    }

    return item.date || item.time || item.due || item.schedule || item.status || 'Upcoming';
  }
}
