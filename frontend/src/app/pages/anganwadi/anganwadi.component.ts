import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-anganwadi',
  templateUrl: './anganwadi.component.html',
  styleUrls: ['./anganwadi.component.css']
})
export class AnganwadiComponent implements OnInit {
  data: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.anganwadi().subscribe(res => this.data = Array.isArray(res) ? res : [res]);
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
      return String(item || 'Anganwadi support');
    }

    return item.title || item.name || item.center || item.worker || item.anganwadi_name || 'Anganwadi support';
  }

  getSecondaryText(item: any): string {
    if (!this.isObject(item)) {
      return 'Community support close to you';
    }

    return item.description || item.message || item.note || item.address || 'Important support and services from your nearby Anganwadi';
  }

  getAccentText(item: any): string {
    if (!this.isObject(item)) {
      return 'Nearby';
    }

    return item.phone || item.contact || item.time || item.status || 'Nearby';
  }
}
