import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: any[] = [];
  message = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  send() {
    this.messages.push({ type: 'user', text: this.message });

    this.api.chat(this.message).subscribe((res: any) => {
      this.messages.push({
        type: 'bot',
        text: res?.response || res?.reply || res?.message || ''
      });
    });

    this.message = '';
  }

}
