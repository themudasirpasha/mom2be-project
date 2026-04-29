import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocalizationService } from './localization.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  constructor(private http: HttpClient, private localization: LocalizationService) {}

  private getSharedPayload(message = '') {
    const session_id = localStorage.getItem('session_id') || '';
    const language = this.localization.getCurrentLanguage();
    const mother_name = localStorage.getItem('mother_name') || '';
    const week = Number(sessionStorage.getItem('week') || 0);

    return {
      message,
      language,
      mother_name,
      week,
      session_id
    };
  }

  getHeaders() {
    const session_id = localStorage.getItem('session_id');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'session_id': session_id || ''
      })
    };
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  getCalendar() {
    const session_id = localStorage.getItem('session_id');
    return this.http.get(`${this.baseUrl}/calendar/${session_id}`);
  }

  getProfile() {
    const session_id = localStorage.getItem('session_id');
    return this.http.get(`${this.baseUrl}/profile/${session_id}`);
  }

  getAlerts() {
    const session_id = localStorage.getItem('session_id');
    return this.http.get(`${this.baseUrl}/alerts/${session_id}`);
  }

  normalizeAlertsResponse(res: any): any[] {
    const rawAlerts = res?.data?.alerts ?? res?.alerts ?? res?.data ?? res;
    return this.normalizeAlertCollection(rawAlerts);
  }

  chat(message: string) {
    return this.http.post(
      `${this.baseUrl}/chat`,
      this.getSharedPayload(message),
      this.getHeaders()
    );
  }

  ashaBrief(message: string) {
    return this.http.post(
      `${this.baseUrl}/asha-brief`,
      this.getSharedPayload(message),
      this.getHeaders()
    );
  }

  symptom(text: string) {
    return this.http.post(
      `${this.baseUrl}/symptom-check`,
      this.getSharedPayload(text),
      this.getHeaders()
    );
  }

  medicine() {
    return this.http.post(
      `${this.baseUrl}/medicine-reminder`,
      this.getSharedPayload(),
      this.getHeaders()
    );
  }

  injection() {
    return this.http.post(
      `${this.baseUrl}/injection-reminder`,
      this.getSharedPayload(),
      this.getHeaders()
    );
  }

  schemes() {
    return this.http.post(
      `${this.baseUrl}/schemes`,
      this.getSharedPayload(),
      this.getHeaders()
    );
  }

  anganwadi() {
    return this.http.post(
      `${this.baseUrl}/anganwadi-reminder`,
      this.getSharedPayload(),
      this.getHeaders()
    );
  }

  getJoy() {
    const session_id = localStorage.getItem('session_id');
    return this.http.get(`${this.baseUrl}/joy/${session_id}`);
  }

  getAmmaCircleMessages(trimester: string, taluk: string) {
    return this.http.post(
      `${this.baseUrl}/amma-circle/chat/messages`,
      {
        trimester,
        taluk,
        session_id: localStorage.getItem('session_id') || '',
        mother_name: localStorage.getItem('mother_name') || ''
      },
      this.getHeaders()
    );
  }

  postAmmaCircleMessage(message: string) {
    return this.http.post(
      `${this.baseUrl}/amma-circle/chat/post`,
      {
        message,
        session_id: localStorage.getItem('session_id') || '',
        mother_name: localStorage.getItem('mother_name') || '',
        author: localStorage.getItem('mother_name') || ''
      },
      this.getHeaders()
    );
  }

  getTopNames() {
    return this.http.get(`${this.baseUrl}/amma-circle/name/top`, this.getHeaders());
  }

  postBabyName(name: string) {
    return this.http.post(
      `${this.baseUrl}/amma-circle/name/post`,
      {
        session_id: localStorage.getItem('session_id') || '',
        baby_name: name,
        language: this.localization.getCurrentLanguage()
      },
      this.getHeaders()
    );
  }

  voteBabyName(nameId: string | number, vote?: string) {
    return this.http.post(
      `${this.baseUrl}/amma-circle/name/vote`,
      { name_id: nameId, vote, session_id: localStorage.getItem('session_id') || '' },
      this.getHeaders()
    );
  }

  getCelebrationWall() {
    return this.http.get(`${this.baseUrl}/amma-circle/celebration-wall`, this.getHeaders());
  }

  postBirthAnnouncement(payload: { baby_name: string; message: string; location: string }) {
    return this.http.post(
      `${this.baseUrl}/amma-circle/birth-announcement`,
      {
        ...payload,
        session_id: localStorage.getItem('session_id') || ''
      },
      this.getHeaders()
    );
  }

  uploadLabReport(formData: FormData) {
    const session_id = localStorage.getItem('session_id');
    const headers = new HttpHeaders({
      session_id: session_id || ''
    });
    return this.http.post(`${this.baseUrl}/upload-lab-report`, formData, { headers });
  }

  getLabReports() {
    const session_id = localStorage.getItem('session_id');
    return this.http.get(`${this.baseUrl}/lab-reports/${session_id}`);
  }

  history() {
    const session_id = localStorage.getItem('session_id');
    return this.http.get(`${this.baseUrl}/history/${session_id}`);
  }

  private normalizeAlertCollection(rawAlerts: any): any[] {
    if (Array.isArray(rawAlerts)) {
      return rawAlerts
        .map((alert, index) => this.normalizeAlertItem(alert, index))
        .filter(Boolean);
    }

    if (typeof rawAlerts === 'string') {
      return [this.normalizeAlertString(rawAlerts, 0)];
    }

    if (rawAlerts && typeof rawAlerts === 'object') {
      if (Array.isArray(rawAlerts.alerts)) {
        return rawAlerts.alerts
          .map((alert: any, index: number) => this.normalizeAlertItem(alert, index))
          .filter(Boolean);
      }

      return [this.normalizeAlertItem(rawAlerts, 0)];
    }

    return [];
  }

  private normalizeAlertItem(alert: any, index: number): any {
    if (typeof alert === 'string') {
      return this.normalizeAlertString(alert, index);
    }

    if (!alert || typeof alert !== 'object') {
      return null;
    }

    const title = this.extractAlertTitle(alert);
    const subtitle = this.extractAlertSubtitle(alert);
    const details = this.extractAlertDetails(alert);

    return {
      id: alert.id ?? alert.alert_id ?? `alert-${index}`,
      ...alert,
      title,
      subtitle,
      description: details
    };
  }

  private normalizeAlertString(value: string, index: number): any {
    const cleaned = String(value || '').replace(/\r/g, '').trim();
    const lines = cleaned
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    const title = lines[0] || 'Important alert';
    const subtitle = lines[1] || 'Personal reminder';
    const description = lines.join('\n');

    return {
      id: `alert-${index}`,
      title,
      subtitle,
      description,
      message: description
    };
  }

  private extractAlertTitle(alert: any): string {
    return String(alert?.title || alert?.alert || alert?.type || alert?.headline || alert?.message || 'Important alert').trim();
  }

  private extractAlertSubtitle(alert: any): string {
    return String(alert?.subtitle || alert?.summary || alert?.time || alert?.date || alert?.status || alert?.message || 'Important reminder').trim();
  }

  private extractAlertDetails(alert: any): string {
    return String(alert?.description || alert?.message || alert?.details || alert?.note || '').trim();
  }
}
