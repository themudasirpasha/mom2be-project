import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalizationService } from './localization.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseUrl = '/api';

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

  chat(message: string) {
    return this.http.post(
      `${this.baseUrl}/chat`,
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

  history() {
    const session_id = localStorage.getItem('session_id');
    return this.http.get(`${this.baseUrl}/history/${session_id}`);
  }
}
