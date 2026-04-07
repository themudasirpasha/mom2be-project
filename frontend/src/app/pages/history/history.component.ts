import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface HistoryItem {
  role: string;
  message: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  history: HistoryItem[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.history().subscribe((res: any) => {
      this.history = Array.isArray(res?.history) ? res.history : [];
    });
  }

  formatRole(role: string): string {
    const value = (role || '').trim();
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Message';
  }
}
