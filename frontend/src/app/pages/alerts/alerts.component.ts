import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAlerts().subscribe((res: any) => {
      this.alerts = Array.isArray(res?.alerts) ? res.alerts : Array.isArray(res) ? res : [];
    });
  }

  objectEntries(value: Record<string, any> | null | undefined): { key: string; value: any }[] {
    return Object.entries(value || {}).map(([key, entryValue]) => ({ key, value: entryValue }));
  }

  formatKey(key: string): string {
    return key.split('_').join(' ');
  }

  getAlertTitle(alert: any): string {
    return alert?.title || alert?.alert || alert?.type || alert?.message || 'Important alert';
  }

  getAlertSubtitle(alert: any): string {
    return alert?.subtitle || alert?.summary || alert?.time || alert?.date || 'Important reminder';
  }

  getAlertDetails(alert: any): string {
    return alert?.description || alert?.message || alert?.details || alert?.note || '';
  }
}
