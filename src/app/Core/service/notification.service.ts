import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { INotification } from '../Interface/inotification';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        this.addListeners();
      })
      .catch(err => {});
  }

  stopConnection() {
    this.hubConnection.stop();
  }

  private addListeners() {
    this.hubConnection.on("ReceiveNotification", (data: INotification) => {

      this.newNotification.set(data);
      console.log("first")

      this.notifications.update(list => [data, ...list]);
    });
  }

  markAsRead(id: string):Observable<any> {
  return this.http.put(`${this.baseUrl}/mark-read/${id}`, {});
}
}
