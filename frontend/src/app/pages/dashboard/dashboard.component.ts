import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: any[] = [];
  motherName = '';
  week = '';
  babySize = '';
  edd = '';
  daysRemaining = '';
  profile: Record<string, any> | null = null;
  alerts: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.motherName = localStorage.getItem('mother_name') || 'Amma';
    this.syncCalendarFromSession();
    this.loadCalendar();
    this.loadProfile();
    this.loadAlerts();
  }

  private loadCalendar(): void {
    this.api.getCalendar().subscribe((res: any) => {
      const calendarEntry = this.extractCalendarEntry(res);
      this.data = calendarEntry ? [calendarEntry] : [];
      const week = calendarEntry?.current_week ?? calendarEntry?.week;
      const babySize = calendarEntry?.baby_size || calendarEntry?.babySize || calendarEntry?.baby_size_text || '';
      const edd = calendarEntry?.edd || calendarEntry?.EDD || '';
      const daysRemaining = calendarEntry?.days_remaining ?? calendarEntry?.daysRemaining;

      if (week !== undefined && week !== null) {
        sessionStorage.setItem('week', String(week));
      }

      if (babySize) {
        sessionStorage.setItem('baby_size', String(babySize));
      }

      if (edd) {
        sessionStorage.setItem('edd', String(edd));
      }

      if (daysRemaining !== undefined && daysRemaining !== null) {
        sessionStorage.setItem('days_remaining', String(daysRemaining));
      }

      this.syncCalendarFromSession();
    });
  }

  private syncCalendarFromSession(): void {
    this.week = sessionStorage.getItem('week') || '';
    this.babySize = sessionStorage.getItem('baby_size') || '';
    this.edd = sessionStorage.getItem('edd') || '';
    this.daysRemaining = sessionStorage.getItem('days_remaining') || '';
  }

  private extractCalendarEntry(res: any): any {
    if (Array.isArray(res)) {
      return res[0] || null;
    }

    if (Array.isArray(res?.calendar)) {
      return res.calendar[0] || null;
    }

    if (Array.isArray(res?.data)) {
      return res.data[0] || null;
    }

    if (res?.calendar && typeof res.calendar === 'object') {
      return res.calendar;
    }

    if (res?.data && typeof res.data === 'object') {
      return res.data;
    }

    if (res && typeof res === 'object') {
      return res;
    }

    return null;
  }

  private loadProfile(): void {
    this.api.getProfile().subscribe((res: any) => {
      this.profile = res?.profile || res || null;
    });
  }

  private loadAlerts(): void {
    this.api.getAlerts().subscribe((res: any) => {
      this.alerts = Array.isArray(res?.alerts) ? res.alerts : Array.isArray(res) ? res : [];
    });
  }

  getProfileName(): string {
    if (!this.profile) {
      return this.motherName;
    }

    return this.profile['mother_name'] || this.profile['name'] || this.motherName;
  }

  getProfilePreview(): { key: string; value: any }[] {
    return Object.entries(this.profile || {}).slice(0, 3).map(([key, value]) => ({ key, value }));
  }

  getAlertTitle(alert: any): string {
    return alert?.title || alert?.alert || alert?.type || alert?.message || 'Important alert';
  }

  getAlertSubtitle(alert: any): string {
    const value = alert?.subtitle || alert?.summary || alert?.time || alert?.date || alert?.message || 'Important reminder';
    return this.truncateText(String(value), 64);
  }

  formatKey(key: string): string {
    return key.split('_').join(' ');
  }

  truncateText(value: string, maxLength: number): string {
    if (!value || value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength).trim()}...`;
  }

  getAlertPreviewLines(): string[] {
    return this.alerts
      .slice(0, 3)
      .map((alert: any) => {
        const title = this.getAlertTitle(alert);
        const subtitle = this.getAlertSubtitle(alert);
        return subtitle ? `${title}: ${subtitle}` : title;
      })
      .map((line: string) => this.truncateText(line, 88));
  }
}
