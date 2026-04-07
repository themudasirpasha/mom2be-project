import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.css']
})
export class SchemesComponent implements OnInit {
  data: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.schemes().subscribe(res => this.data = Array.isArray(res) ? res : [res]);
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
      return String(item || 'Support scheme');
    }

    return item.title || item.name || item.scheme || item.scheme_name || 'Support scheme';
  }

  getSecondaryText(item: any): string {
    if (!this.isObject(item)) {
      return 'Government support curated for you';
    }

    return item.description || item.summary || item.benefit || item.message || 'Helpful support and benefits for your pregnancy journey';
  }

  getAccentText(item: any): string {
    if (!this.isObject(item)) {
      return 'Eligible';
    }

    return item.amount || item.benefit_amount || item.status || item.category || 'Eligible';
  }
}
