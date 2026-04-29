import { Injectable } from '@angular/core';
import { LocalizationService } from './localization.service';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private localization: LocalizationService) {}

  setSession(id: string) {
    localStorage.setItem('session_id', id);
  }

  getSession() {
    return localStorage.getItem('session_id');
  }

  setLanguage(lang: string) {
    localStorage.setItem('language', this.localization.normalizeLanguage(lang));
  }

  getLanguage() {
    return this.localization.getCurrentLanguage();
  }
}
