import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Record<string, any> | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getProfile().subscribe((res: any) => {
      this.profile = res?.profile || res || null;
    });
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
}
