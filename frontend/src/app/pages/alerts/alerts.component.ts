import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

type AlertSeverity = 'high' | 'medium' | 'low';

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
      this.alerts = this.api.normalizeAlertsResponse(res);
    });
  }

  objectEntries(value: Record<string, any> | null | undefined): { key: string; value: any }[] {
    const hiddenKeys = new Set(['id', 'title', 'subtitle', 'description', 'message']);
    return Object.entries(value || {})
      .filter(([key, entryValue]) => !hiddenKeys.has(key) && entryValue !== null && entryValue !== undefined && entryValue !== '')
      .map(([key, entryValue]) => ({ key, value: entryValue }));
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

  getAlertSeverity(alert: any): AlertSeverity {
    const explicitSeverity = String(
      alert?.severity || alert?.priority || alert?.risk || alert?.level || ''
    ).toLowerCase();

    if (explicitSeverity.includes('high')) {
      return 'high';
    }

    if (explicitSeverity.includes('medium') || explicitSeverity.includes('moderate')) {
      return 'medium';
    }

    if (explicitSeverity.includes('low')) {
      return 'low';
    }

    const combinedText = `${this.getAlertTitle(alert)} ${this.getAlertSubtitle(alert)} ${this.getAlertDetails(alert)}`.toLowerCase();

    if (
      combinedText.includes('urgent') ||
      combinedText.includes('immediately') ||
      combinedText.includes('danger') ||
      combinedText.includes('critical') ||
      combinedText.includes('emergency')
    ) {
      return 'high';
    }

    if (
      combinedText.includes('follow up') ||
      combinedText.includes('monitor') ||
      combinedText.includes('soon') ||
      combinedText.includes('upcoming')
    ) {
      return 'medium';
    }

    return 'low';
  }

  getAlertSeverityLabel(alert: any): string {
    const severity = this.getAlertSeverity(alert);

    if (severity === 'high') {
      return 'HIGH';
    }

    if (severity === 'medium') {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  getAlertSeveritySymbol(alert: any): string {
    const severity = this.getAlertSeverity(alert);

    if (severity === 'high') {
      return '!';
    }

    if (severity === 'medium') {
      return '~';
    }

    return '+';
  }
}
