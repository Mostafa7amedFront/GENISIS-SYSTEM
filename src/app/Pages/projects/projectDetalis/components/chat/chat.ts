import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  username: string;
  text: string;
  time: string;
  date: string;
  timestamp: Date;
  files?: ChatFile[];

}
interface ChatFile {
  name: string;
  url: string;
  type: string; // image, pdf, docx ...
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat {
  messages: ChatMessage[] = [];
  messageText: string = '';
  lastMessageTimestamp: Date | null = null;

  constructor() {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
      now.setDate(now.getDate() - 3);
    this.messages = [
      {
        username: 'Mostafa',
        text: 'Hey! how are you?',
        time: this.getCurrentTime(now),
        date: this.getFormattedDate(now),
        timestamp: now
      },
      {
        username: 'Miar',
        text: 'I am good, thanks! Working on Angular project 💻',
        time: this.getCurrentTime(now),
        date: this.getFormattedDate(now),
        timestamp: now,
         files: [
          { name: 'design.png', url: 'assets/files/design.png', type: 'image' },
          { name: 'report.pdf', url: 'assets/files/report.pdf', type: 'pdf' }
        ],
      },
      {
        username: 'Mostafa',
        text: 'Nice! Keep going 🚀',
        time: this.getCurrentTime(now),
        date: this.getFormattedDate(now),
        timestamp: now
      },
      {
        username: 'System',
        text: 'Yesterday message example.',
        time: this.getCurrentTime(yesterday),
        date: this.getFormattedDate(yesterday),
        timestamp: yesterday
      }
    ];

    this.lastMessageTimestamp = now;
  }

  // get current time in HH:MM AM/PM format
  private getCurrentTime(date: Date = new Date()): string {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  // get formatted date
  private getFormattedDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private isNewDay(current: Date): boolean {
    if (!this.lastMessageTimestamp) return true;
    return current.toDateString() !== this.lastMessageTimestamp.toDateString();
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    if (!text) return;

    const now = new Date();
    const message: ChatMessage = {
      username: 'Mostafa Hamed',
      text,
      time: this.getCurrentTime(now),
      date: this.getFormattedDate(now),
      timestamp: now
    };

    this.messages.push(message);
    this.lastMessageTimestamp = now;
    this.messageText = '';
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
