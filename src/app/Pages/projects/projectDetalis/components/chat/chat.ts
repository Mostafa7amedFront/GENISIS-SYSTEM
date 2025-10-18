import { Component, effect, signal, inject } from '@angular/core';
import { ChatService } from '../../../../../Core/service/chat.service';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [ReactiveModeuls],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat {
  messageText = signal('');
  projectId = '';
  selectedFiles: File[] = [];
  private chatService = inject(ChatService);
  messages = this.chatService.messages;

  constructor(private route: ActivatedRoute) {
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
            date: group.relativeDateString,
            time: new Date(chat.sentAt).toLocaleTimeString(),
            files: chat.attachments || []
          }))
        );

        this.chatService.messages.set(chats);
      },
      error: (err) => console.error('Error loading messages:', err)
    });
  }

  sendMessage(): void {
    const text = this.messageText().trim();
    if (!text && this.selectedFiles.length === 0) return;

    const files = [...this.selectedFiles];
    this.selectedFiles = [];
    this.messageText.set('');

    this.chatService.sendChatMessage(this.projectId, text, files);
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

    handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  ngOnDestroy(): void {
    this.chatService.stopConnection();
  }
}
