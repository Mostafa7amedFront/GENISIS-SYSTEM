import { Component, effect, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../../../Core/service/chat.service';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { ShortenPipe } from '../../../../../Shared/pipes/shorten-pipe';
import { IChatAttachmentMessages, IChatLink } from '../../../../../Core/Interface/ichat';
import { DownloadFileService } from '../../../../../Core/service/download-file.service';

@Component({
  selector: 'app-chat',
  imports: [ReactiveModeuls, ShortenPipe],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss'],
})
export class Chat {
  // Signals
  messageText = signal('');
  messagesLinks = signal<IChatLink[]>([]);
  AttachmentMessages = signal<IChatAttachmentMessages[]>([]);

  // State
  private _activeTab: 'chat' | 'documents' | 'links' = 'chat';
  loadedTabs = { documents: false, links: false };
  projectId = '';
  selectedFiles: File[] = [];
  baseurl = 'https://genesissystem.runasp.net';
  currentUserId = localStorage.getItem('user_id');

  // Services
  private chatService = inject(ChatService);

  // Debounce
  debounceTimer: any;

  // Reactive messages
  messages = this.chatService.messages;

  constructor(private route: ActivatedRoute ,  private _downloadFile :DownloadFileService) {
    effect(() => {
      const msgs = this.messages();
      if (msgs.length) {
        setTimeout(() => {
          const box = document.querySelector('.chat-box');
          box?.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    });
  }

  get activeTab() {
    return this._activeTab;
  }

  set activeTab(value: 'chat' | 'documents' | 'links') {
    this._activeTab = value;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      switch (value) {
        case 'documents':
          if (!this.loadedTabs.documents) {
            this.getMessageAttachment();
            this.loadedTabs.documents = true;
          }
          break;

        case 'links':
          if (!this.loadedTabs.links) {
            this.getMessageLink();
            this.loadedTabs.links = true;
          }
          break;

        case 'chat':
          break;
      }
    }, 200);
  }

  get linePosition() {
    switch (this.activeTab) {
      case 'chat':
        return 'translateX(0%)';
      case 'documents':
        return 'translateX(100%)';
      case 'links':
        return 'translateX(200%)';
      default:
        return 'translateX(0%)';
    }
  }

  async ngOnInit(): Promise<void> {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    await this.chatService.startConnection();
    await this.chatService.joinProjectGroup(this.projectId);

    this.chatService.getAllMessages(this.projectId).subscribe({
      next: (res: any) => {
        const items = res?.value?.items ?? [];
        const chats = items.flatMap((group: any) =>
          group.chats.map((chat: any) => ({
            id: chat.id,
            text: chat.message,
            username: chat.userName,
             userImageUrl: chat.userImageUrl,
            date: group.relativeDateString,
            time: new Date(chat.sentAt).toLocaleTimeString(),
            files: chat.attachments || [],
          }))
        );

        this.chatService.messages.set(chats);
      },
      error: (err) => console.error('Error loading messages:', err),
    });
  }

  ngOnDestroy(): void {
    this.chatService.stopConnection();
  }
isImage(fileUrl: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(fileUrl);
}
isLink(text: string): boolean {
  if (!text) return false;
  const urlRegex =
    /(https?:\/\/[^\s]+)|(www\.[^\s]+)/i;
  return urlRegex.test(text);
}

formatLink(text: string): string {
  if (text.startsWith('http')) {
    return text;
  }
  return 'https://' + text;
}

downloadFile(fileUrl: any) {
  this._downloadFile.downloadFile(fileUrl).subscribe({
    next: (blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;

      // extract filename
      const fileName = fileUrl.split('/').pop() ?? 'downloaded_file';
      a.download = fileName;

      a.click();

      URL.revokeObjectURL(objectUrl);
    },
    error: (err) => {
      console.log("Download error:", err);
    }
  });
}
  // Chat Methods
  sendMessage(): void {
    const text = this.messageText().trim();
    if (!text && this.selectedFiles.length === 0) return;

    const files = [...this.selectedFiles];
    this.selectedFiles = [];
    this.messageText.set('');

    this.chatService.sendChatMessage(this.projectId, text, files);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
    }

    input.value = '';
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getMessageLink() {
    this.chatService.getLinkChat(this.projectId).subscribe({
      next: (msg) => {
        this.messagesLinks.set(msg.value);
      },
    });
  }

  getMessageAttachment() {
    this.chatService.GetAttachmentMessages(this.projectId).subscribe({
      next: (msg) => {
        this.AttachmentMessages.set(msg.value);
      },
    });
  }
}
