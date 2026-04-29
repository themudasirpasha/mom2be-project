import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

type AlertSeverity = 'high' | 'medium' | 'low';

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
  joyMessage = '';
  joyDailyMessage = '';
  joyJoke = '';
  joyAssignment = '';
  joyCountdownMessage = '';
  joyWeek: number | null = null;
  joyLoading = false;

  private CALENDAR_CACHE_TTL = 5 * 60 * 1000;
  private PROFILE_CACHE_TTL = 10 * 60 * 1000;
  private ALERTS_CACHE_TTL = 5 * 60 * 1000;
  private JOY_CACHE_TTL = 30 * 60 * 1000;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.motherName = localStorage.getItem('mother_name') || 'Amma';
    this.syncCalendarFromSession();
    this.loadCalendar();
    this.loadProfile();
    this.loadJoy();
    this.loadAlerts();
  }

  private loadCalendar(): void {
    const cached = this.getCachedData('dashboard_calendar');
    if (cached) {
      this.processCalendarData(cached);
      return;
    }

    this.api.getCalendar().subscribe((res: any) => {
      this.setCachedData('dashboard_calendar', res);
      this.processCalendarData(res);
    });
  }

  private processCalendarData(res: any): void {
    const calendarEntry = this.extractCalendarEntry(res);
    this.data = calendarEntry ? [calendarEntry] : [];
    const week = calendarEntry?.current_week ?? calendarEntry?.week;
    const babySize = this.resolveBabySize(calendarEntry);
    const edd = calendarEntry?.edd || calendarEntry?.EDD || '';
    const daysRemaining = calendarEntry?.days_remaining ?? calendarEntry?.daysRemaining;

    this.babySize = babySize;

    if (week !== undefined && week !== null) {
      sessionStorage.setItem('week', String(week));
    }

    if (babySize !== '') {
      sessionStorage.setItem('baby_size', babySize);
    }

    if (edd) {
      sessionStorage.setItem('edd', String(edd));
    }

    if (daysRemaining !== undefined && daysRemaining !== null) {
      sessionStorage.setItem('days_remaining', String(daysRemaining));
    }

    this.syncCalendarFromSession();
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

  private resolveBabySize(entry: any): string {
    const raw = entry?.baby_size ?? entry?.babySize ?? entry?.baby_size_text ?? entry?.babySizeText ?? '';

    if (raw === null || raw === undefined) {
      return '';
    }

    if (typeof raw === 'string') {
      return raw.trim();
    }

    if (typeof raw === 'number' || typeof raw === 'boolean') {
      return String(raw);
    }

    if (Array.isArray(raw)) {
      return raw
        .map(item => (item && typeof item === 'object' ? JSON.stringify(item) : String(item)))
        .join(', ')
        .trim();
    }

    if (typeof raw === 'object') {
      return String(raw.text || raw.value || raw.name || raw.label || raw.description || JSON.stringify(raw)).trim();
    }

    return String(raw).trim();
  }

  private loadProfile(): void {
    const cached = this.getCachedData('dashboard_profile');
    if (cached) {
      this.profile = cached?.profile || cached || null;
      this.persistLocationFields(this.profile);
      return;
    }

    this.api.getProfile().subscribe((res: any) => {
      this.setCachedData('dashboard_profile', res);
      this.profile = res?.profile || res || null;
      this.persistLocationFields(this.profile);
    });
  }

  private loadJoy(): void {
    const cached = this.getCachedData('dashboard_joy');
    if (cached) {
      this.processJoyData(cached);
      return;
    }

    this.joyLoading = true;
    this.api.getJoy().subscribe(
      (res: any) => {
        this.setCachedData('dashboard_joy', res);
        this.processJoyData(res);
      },
      (error) => {
        console.error('Could not load joy message:', error);
        this.joyMessage = '';
        this.joyDailyMessage = '';
        this.joyJoke = '';
        this.joyAssignment = '';
        this.joyCountdownMessage = '';
        this.joyLoading = false;
      }
    );
  }

  private loadAlerts(): void {
    const cached = this.getCachedData('dashboard_alerts');
    if (cached) {
      this.alerts = this.api.normalizeAlertsResponse(cached);
      return;
    }

    this.api.getAlerts().subscribe((res: any) => {
      this.setCachedData('dashboard_alerts', res);
      this.alerts = this.api.normalizeAlertsResponse(res);
    });
  }

  private processJoyData(res: any): void {
    this.joyDailyMessage = String(res?.daily?.daily_message || res?.daily_message || '').trim();
    this.joyJoke = String(res?.daily?.joke || res?.joke || '').trim();
    const assignment = res?.assignment || {};
    this.joyAssignment = String(
      `${assignment?.emoji ? assignment.emoji + ' ' : ''}${assignment?.task || assignment?.assignment || ''}`.trim()
    );
    this.joyCountdownMessage = String(res?.countdown?.message || res?.message || '').trim();
    this.joyWeek = Number(res?.week ?? res?.countdown?.days_remaining ?? (this.week || 0)) || null;
    this.joyLoading = false;
  }

  private persistLocationFields(profile: Record<string, any> | null): void {
    const district = String(profile?.['district'] || profile?.['District'] || '').trim();
    const taluk = String(profile?.['taluk'] || profile?.['Taluk'] || '').trim();

    if (district) {
      localStorage.setItem('district', district);
    }

    if (taluk) {
      localStorage.setItem('taluk', taluk);
    }
  }

  // Cache utility methods
  private getCachedData(key: string): any {
    try {
      const cached = sessionStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      let ttl = this.CALENDAR_CACHE_TTL;

      if (key.includes('profile')) ttl = this.PROFILE_CACHE_TTL;
      else if (key.includes('alerts')) ttl = this.ALERTS_CACHE_TTL;
      else if (key.includes('joy')) ttl = this.JOY_CACHE_TTL;

      if (now - timestamp < ttl) {
        return data;
      }

      sessionStorage.removeItem(`cache_${key}`);
      return null;
    } catch {
      return null;
    }
  }

  private setCachedData(key: string, data: any): void {
    try {
      sessionStorage.setItem(
        `cache_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      );
    } catch {
    }
  }

  getProfileName(): string {
    if (!this.profile) {
      return this.motherName;
    }

    return this.profile['mother_name'] || this.profile['name'] || this.motherName;
  }

  getProfilePreview(): { key: string; value: any }[] {
    return Object.entries(this.profile || {}).slice(0, 4).map(([key, value]) => ({ key, value }));
  }

  getAlertTitle(alert: any): string {
    return alert?.title || alert?.alert || alert?.type || alert?.message || 'Important alert';
  }

  getAlertSubtitle(alert: any): string {
    const value = alert?.subtitle || alert?.summary || alert?.time || alert?.date || alert?.message || 'Important reminder';
    return this.truncateText(String(value), 64);
  }

  getAlertDetails(alert: any): string {
    const value = alert?.description || alert?.message || alert?.details || alert?.note || '';
    return this.truncateText(String(value), 92);
  }

  getJoyName(): string {
    return this.motherName || 'Mama';
  }

  getJoyWeek(): number | null {
    const week = Number(this.joyWeek ?? this.getWeekNumber() ?? 0);
    return Number.isFinite(week) && week > 0 ? Math.round(week) : null;
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

  getJourneyProgress(): number {
    const week = Number(this.week);

    if (!Number.isFinite(week) || week <= 0) {
      return 8;
    }

    return Math.min(100, Math.max(8, Math.round((week / 40) * 100)));
  }

  getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning';
    }

    if (hour < 17) {
      return 'Good afternoon';
    }

    return 'Good evening';
  }

  getWeekNumber(): number | null {
    const week = Number(this.week);

    if (!Number.isFinite(week) || week <= 0) {
      return null;
    }

    return Math.round(week);
  }

  getTrimesterLabel(): string {
    const week = this.getWeekNumber();

    if (!week) {
      return '—';
    }

    if (week <= 13) {
      return '1st';
    }

    if (week <= 27) {
      return '2nd';
    }

    return '3rd';
  }

  getDaysToGoLabel(): string {
    const days = Number(this.daysRemaining);

    if (!Number.isFinite(days) || days <= 0) {
      return 'Updating';
    }

    return `${Math.round(days)} days to go`;
  }

  getBabySizeShort(): string {
    const value = String(this.babySize || '')
      .trim()
      .replace(/\uFFFD/g, '')
      .replace(/\s+/g, ' ');

    if (!value) {
      return 'Coming soon';
    }

    return this.truncateText(value, 50);
  }

  getAlertPreviewItems(): any[] {
    return [...this.alerts]
      .sort((first, second) => this.getSeverityWeight(second) - this.getSeverityWeight(first))
      .slice(0, 3);
  }

  getPrimaryAlert(): any | null {
    return this.getAlertPreviewItems()[0] || null;
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

  private getSeverityWeight(alert: any): number {
    const severity = this.getAlertSeverity(alert);

    if (severity === 'high') {
      return 3;
    }

    if (severity === 'medium') {
      return 2;
    }

    return 1;
  }
}
