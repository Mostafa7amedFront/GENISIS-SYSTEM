import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { INotification } from '../Interface/inotification';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private baseUrl = 'https://genesissystem.runasp.net/api/Notification';
private hubUrl = 'https://genesissystem.runasp.net/hubs/notification';

  private hubConnection!: HubConnection;

  notifications = signal<INotification[]>([]);
  newNotification = signal<INotification | null>(null);

  constructor(private http: HttpClient) {}

  getAllNotifications() {
    return this.http.get<{success: boolean, value: INotification[]}>(`${this.baseUrl}/all`);
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
      .then(() => {
        console.log("SignalR Connected");
        this.addListeners();
      })
      .catch(err => console.log("Error while starting SignalR", err));
  }

  stopConnection() {
    this.hubConnection.stop();
  }

  private addListeners() {
    this.hubConnection.on("ReceiveNotification", (data: INotification) => {
      console.log("New Notification From Server:", data);

      this.newNotification.set(data);

      this.notifications.update(list => [data, ...list]);
    });
  }

  markAsRead(id: string):Observable<any> {
  return this.http.put(`${this.baseUrl}/mark-read/${id}`, {});
}
}
