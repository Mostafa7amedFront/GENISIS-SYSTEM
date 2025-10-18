import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  private API_URL = `${environment.baseimageUrl}`;
  private token = localStorage.getItem('auth_token');
  private currentProjectId: string | null = null;

  // ✅ Signals
  messages = signal<any[]>([]);
  status = signal<string>('disconnected');

  constructor(private http: HttpClient) {}

  public async startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.API_URL}hubs/chat`, {
        accessTokenFactory: () => this.token ?? ''
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.registerHandlers();

    try {
      await this.hubConnection.start();
      this.status.set('connected');
      console.log('✅ SignalR connected');
    } catch (err) {
      console.error('❌ Error establishing connection: ', err);
      this.status.set('error');
    }
  }

  private registerHandlers(): void {
    const currentUser = localStorage.getItem('user_name') || 'You';

    this.hubConnection.on('ReceiveMessage', (msg) => {
      const formattedMsg = {
        id: msg.id || crypto.randomUUID(),
        text: msg.text || msg.message || '',
        username: msg.username || msg.userName || currentUser,
        date: msg.date || 'Today',
        time: msg.time || new Date().toLocaleTimeString(),
        files: msg.files || msg.attachments?.map((a: any) => ({
          name: a.name || a.fileName,
          type: a.type || a.contentType
        })) || []
      };

      this.messages.update(curr => {
        const filtered = curr.filter(m => m.text !== formattedMsg.text || m.username !== currentUser);
        return [...filtered, formattedMsg];
      });
    });

    this.hubConnection.on('UserJoined', (userName) => {
      this.messages.update(curr => [
        ...curr,
        { system: true, text: `${userName || 'Anonymous'} joined the chat` }
      ]);
    });

    this.hubConnection.on('UserLeft', (userName) => {
      this.messages.update(curr => [
        ...curr,
        { system: true, text: `${userName || 'Anonymous'} left the chat` }
      ]);
    });

    this.hubConnection.onreconnecting(() => this.status.set('reconnecting'));
    this.hubConnection.onreconnected(() => this.status.set('connected'));
    this.hubConnection.onclose(() => this.status.set('disconnected'));
  }

  public async joinProjectGroup(projectId: string): Promise<void> {
    if (!this.hubConnection) return;
    try {
      if (this.currentProjectId)
        await this.hubConnection.invoke('LeaveProjectGroup', this.currentProjectId);

      await this.hubConnection.invoke('JoinProjectGroup', projectId);
      this.currentProjectId = projectId;
      console.log(`✅ Joined project group: ${projectId}`);
    } catch (err) {
      console.error('❌ Failed to join project group:', err);
    }
  }

  public sendChatMessage(projectId: string, message: string, files: File[] = []) {
    const formData = new FormData();
    formData.append('Message', message);
    formData.append('ProjectId', projectId);

    files.forEach(file => {
      formData.append('Attachments', file, file.name);
    });

    const newMsg = {
      text: message,
      username: localStorage.getItem('user_name') || 'You',
      date: 'Today',
      time: new Date().toLocaleTimeString(),
      files: files.map(f => ({ name: f.name, type: f.type }))
    };

    this.messages.update(curr => [...curr, newMsg]);

    this.http.post(`${this.API_URL}api/ProjectChat`, formData, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => console.log('✅ Message sent to server'),
      error: err => console.error('❌ Error sending message:', err)
    });
  }

  public getAllMessages(projectId: string) {
    return this.http.get(`${this.API_URL}api/ProjectChat/${projectId}?pageNumber=1&pageSize=500`);
  }

  // ✅ Stop connection
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.status.set('disconnected');
    }
  }
}
