import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { INotification } from '../Interface/inotification';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = `${environment.baseimageUrl}api/Notification`;
  private hubUrl = `${environment.baseimageUrl}hubs/notification`;

  private hubConnection!: HubConnection;

  notifications = signal<INotification[]>([]);
  newNotification = signal<INotification | null>(null);

  // ✅ NEW: unread count signal (الـ Nav هيسمعه)
  unreadCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getAllNotifications() {
    return this.http.get<{ success: boolean; value: INotification[] }>(`${this.baseUrl}/all`);
  }

  getUnreadCount(): Observable<number> {
    return this.http
      .get<{ success: boolean; value: number }>(`${this.baseUrl}/unread-count`)
      .pipe(map(res => res?.value ?? 0));
  }

  // ✅ NEW: تحميل العدد وتخزينه في signal
  loadUnreadCount() {
    this.getUnreadCount().subscribe({
      next: (count) => this.unreadCount.set(count),
      error: () => this.unreadCount.set(0)
    });
  }

  // ---------------------- SIGNALR -----------------------
  startConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => this.addListeners())
      .catch(() => {});
  }

  stopConnection() {
    this.hubConnection?.stop();
  }

  private addListeners() {
    this.hubConnection.on('ReceiveNotification', (data: INotification) => {
      this.newNotification.set(data);
      this.notifications.update(list => [data, ...list]);

      // ✅ زوّد العداد أول ما يجيلك إشعار جديد
      this.unreadCount.update(c => c + 1);
    });
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/mark-read/${id}`, {}).pipe(
      tap(() => {
        this.unreadCount.update(c => Math.max(0, c - 1));
      })
    );
  }
}
