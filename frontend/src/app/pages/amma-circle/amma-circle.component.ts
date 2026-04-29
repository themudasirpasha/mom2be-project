import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

type AmmaCircleTab = 'chat' | 'names' | 'wall';

@Component({
  selector: 'app-amma-circle',
  templateUrl: './amma-circle.component.html',
  styleUrls: ['./amma-circle.component.css']
})
export class AmmaCircleComponent implements OnInit, OnDestroy {
  activeTab: AmmaCircleTab = 'chat';
  private readonly chatRefreshMs = 5000;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private isFetchingMessages = false;
  private currentUserName = '';
  private currentSessionId = '';

  trimester = '1st';
  taluk = '';
  district = '';

  chatMessages: any[] = [];
  chatInput = '';
  chatLoading = false;
  chatSending = false;

  topNames: any[] = [];
  namesLoading = false;
  nameInput = '';
  namePosting = false;
  votingNameId: string | number | null = null;
  voteToastMessage = '';
  voteToastStatus = '';
  private voteToastTimer: ReturnType<typeof setTimeout> | null = null;
  nameToastMessage = '';
  nameToastStatus = '';
  private nameToastTimer: ReturnType<typeof setTimeout> | null = null;

  wallPosts: any[] = [];
  wallLoading = false;
  wallPosting = false;
  birthForm = {
    baby_name: '',
    message: '',
    location: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.taluk = localStorage.getItem('taluk') || '';
    this.district = localStorage.getItem('district') || '';
    this.currentUserName = localStorage.getItem('mother_name') || '';
    this.currentSessionId = localStorage.getItem('session_id') || '';
    this.trimester = this.resolveTrimester();
    this.birthForm.location = [this.taluk, this.district].filter(Boolean).join(', ');

    this.loadMessages();
    this.startMessagePolling();
    this.loadTopNames();
    this.loadCelebrationWall();
  }

  ngOnDestroy(): void {
    this.stopMessagePolling();
    this.clearVoteToastTimer();
    this.clearNameToastTimer();
  }

  setTab(tab: AmmaCircleTab): void {
    this.activeTab = tab;

    if (tab === 'chat') {
      this.loadMessages(undefined, true);
      this.startMessagePolling();
      return;
    }

    this.stopMessagePolling();
  }

  sendChatMessage(): void {
    const message = this.chatInput.trim();
    if (!message || this.chatSending) {
      return;
    }

    this.chatSending = true;
    this.api.postAmmaCircleMessage(message).subscribe(
      () => {
        this.chatInput = '';
        this.loadMessages(() => {
          this.chatSending = false;
        }, true);
      },
      () => {
        this.chatSending = false;
      }
    );
  }

  submitName(): void {
    const name = this.nameInput.trim();
    if (!name || this.namePosting) {
      return;
    }

    this.namePosting = true;
    this.api.postBabyName(name).subscribe(
      (res: any) => {
        const reaction = String(res?.ai_reaction || res?.message || '').trim();
        if (reaction) {
          this.showNameToast(reaction, res?.status || 'posted');
        }
        this.nameInput = '';
        this.loadTopNames(() => {
          this.namePosting = false;
        });
      },
      (error: any) => {
        this.showNameToast(
          error?.error?.message || 'Unable to post the baby name right now.',
          error?.error?.status || 'error'
        );
        this.namePosting = false;
      }
    );
  }

  voteForName(entry: any): void {
    const id = entry?.id ?? entry?.name_id ?? entry?.name ?? entry?.title;
    if (!id || this.votingNameId === id) {
      return;
    }

    this.votingNameId = id;
    this.api.voteBabyName(id, 'upvote').subscribe(
      (res: any) => {
        this.showVoteToast(res?.message || 'Vote updated.', res?.status || 'voted');
        this.loadTopNames(() => {
          this.votingNameId = null;
        });
      },
      (error: any) => {
        this.showVoteToast(
          error?.error?.message || 'Unable to register your vote right now.',
          error?.error?.status || 'error'
        );
        this.votingNameId = null;
      }
    );
  }

  submitBirthAnnouncement(): void {
    if (this.wallPosting) {
      return;
    }

    const baby_name = this.birthForm.baby_name.trim();
    const message = this.birthForm.message.trim();
    const location = this.birthForm.location.trim();

    if (!baby_name || !message) {
      return;
    }

    this.wallPosting = true;
    this.api.postBirthAnnouncement({ baby_name, message, location }).subscribe(
      () => {
        this.birthForm.baby_name = '';
        this.birthForm.message = '';
        this.loadCelebrationWall(() => {
          this.wallPosting = false;
        });
      },
      () => {
        this.wallPosting = false;
      }
    );
  }

  getNameTitle(entry: any): string {
    return String(entry?.name || entry?.baby_name || entry?.title || entry?.label || 'Suggested name').trim();
  }

  getNameVotes(entry: any): number {
    const raw = entry?.votes ?? entry?.vote_count ?? entry?.score ?? 0;
    const votes = Number(raw);
    return Number.isFinite(votes) ? votes : 0;
  }

  getNameAuthor(entry: any): string {
    return String(entry?.posted_by || entry?.mother_name || entry?.author || 'Amma Circle').trim();
  }

  getWallTitle(entry: any): string {
    return String(entry?.baby_name || entry?.title || entry?.name || 'New baby arrival').trim();
  }

  getWallMessage(entry: any): string {
    return String(entry?.message || entry?.announcement || entry?.description || '').trim();
  }

  getWallMeta(entry: any): string {
    return String(entry?.location || entry?.taluk || entry?.district || entry?.posted_at || '').trim();
  }

  trackById(index: number, item: any): string | number {
    return item?.id ?? item?.message_id ?? item?.name_id ?? `${index}-${item?.title || item?.name || 'item'}`;
  }

  private loadMessages(callback?: () => void, force = false): void {
    if (this.isFetchingMessages && !force) {
      callback?.();
      return;
    }

    this.isFetchingMessages = true;
    this.chatLoading = !this.chatMessages.length;
    this.api.getAmmaCircleMessages(this.trimester, this.taluk).subscribe(
      (res: any) => {
        this.chatMessages = this.normalizeMessages(res);
        this.isFetchingMessages = false;
        this.chatLoading = false;
        callback?.();
      },
      () => {
        this.isFetchingMessages = false;
        this.chatLoading = false;
        callback?.();
      }
    );
  }

  private loadTopNames(callback?: () => void): void {
    this.namesLoading = true;
    this.api.getTopNames().subscribe(
      (res: any) => {
        this.topNames = this.extractCollection(res, ['names', 'top', 'leaderboard']);
        this.namesLoading = false;
        callback?.();
      },
      () => {
        this.namesLoading = false;
        callback?.();
      }
    );
  }

  private loadCelebrationWall(callback?: () => void): void {
    this.wallLoading = true;
    this.api.getCelebrationWall().subscribe(
      (res: any) => {
        this.wallPosts = this.extractCollection(res, ['wall', 'posts', 'celebrations']);
        this.wallLoading = false;
        callback?.();
      },
      () => {
        this.wallLoading = false;
        callback?.();
      }
    );
  }

  private normalizeMessages(res: any): any[] {
    const items = this.extractCollection(res, ['messages', 'chat']);

    if (!items.length && typeof res?.data?.message === 'string') {
      return [{ id: 'message-0', text: res.data.message, sender: 'Amma Circle', type: 'bot' }];
    }

    return items.map((message: any, index: number) => {
      if (typeof message === 'string') {
        return {
          id: `message-${index}`,
          text: message,
          sender: index % 2 === 0 ? 'Amma Circle' : 'You',
          type: index % 2 === 0 ? 'bot' : 'user'
        };
      }

      const sender = String(message?.sender || message?.author || message?.mother_name || message?.name || 'Amma Circle').trim();
      const ownerSessionId = String(message?.session_id || message?.user_session_id || message?.sender_session_id || '').trim();
      const normalizedSender = sender.toLowerCase();
      const normalizedCurrentUser = this.currentUserName.trim().toLowerCase();
      const role = String(message?.role || message?.type || '').trim().toLowerCase();
      const isCurrentUserMessage = !!(
        (ownerSessionId && this.currentSessionId && ownerSessionId === this.currentSessionId) ||
        (normalizedSender && normalizedCurrentUser && normalizedSender === normalizedCurrentUser) ||
        role === 'user' ||
        role === 'me'
      );

      return {
        id: message?.id ?? message?.message_id ?? `message-${index}`,
        ...message,
        sender: isCurrentUserMessage ? (this.currentUserName || sender || 'You') : (sender || 'Amma Circle'),
        type: isCurrentUserMessage ? 'user' : 'bot',
        text: String(message?.text || message?.message || message?.content || message?.reply || '').trim(),
        time: String(message?.time || message?.created_at || message?.timestamp || '').trim()
      };
    });
  }

  private startMessagePolling(): void {
    this.stopMessagePolling();
    this.pollTimer = setInterval(() => {
      this.loadMessages();
    }, this.chatRefreshMs);
  }

  private stopMessagePolling(): void {
    if (!this.pollTimer) {
      return;
    }

    clearInterval(this.pollTimer);
    this.pollTimer = null;
  }

  private showVoteToast(message: string, status: string): void {
    this.voteToastMessage = String(message || '').trim();
    this.voteToastStatus = String(status || '').trim().toLowerCase();

    this.clearVoteToastTimer();

    if (!this.voteToastMessage) {
      return;
    }

    this.voteToastTimer = setTimeout(() => {
      this.voteToastMessage = '';
      this.voteToastStatus = '';
      this.voteToastTimer = null;
    }, 3500);
  }

  private clearVoteToastTimer(): void {
    if (!this.voteToastTimer) {
      return;
    }

    clearTimeout(this.voteToastTimer);
    this.voteToastTimer = null;
  }

  private showNameToast(message: string, status: string): void {
    this.nameToastMessage = String(message || '').trim();
    this.nameToastStatus = String(status || '').trim().toLowerCase();

    this.clearNameToastTimer();

    if (!this.nameToastMessage) {
      return;
    }

    this.nameToastTimer = setTimeout(() => {
      this.nameToastMessage = '';
      this.nameToastStatus = '';
      this.nameToastTimer = null;
    }, 4000);
  }

  private clearNameToastTimer(): void {
    if (!this.nameToastTimer) {
      return;
    }

    clearTimeout(this.nameToastTimer);
    this.nameToastTimer = null;
  }

  private extractCollection(res: any, keys: string[]): any[] {
    const data = res?.data ?? res;

    if (Array.isArray(data)) {
      return data;
    }

    for (const key of keys) {
      if (Array.isArray(data?.[key])) {
        return data[key];
      }

      if (Array.isArray(res?.[key])) {
        return res[key];
      }
    }

    if (data && typeof data === 'object') {
      return Object.values(data).find(value => Array.isArray(value)) as any[] || [];
    }

    return [];
  }

  private resolveTrimester(): string {
    const week = Number(sessionStorage.getItem('week') || 0);

    if (!Number.isFinite(week) || week <= 13) {
      return '1st';
    }

    if (week <= 27) {
      return '2nd';
    }

    return '3rd';
  }
}
