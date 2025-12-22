import { Component, computed, inject, signal } from '@angular/core';
import { NotificationService } from '../../Core/service/notification.service';
import { CommonModule, DatePipe } from '@angular/common';
import { INotification } from '../../Core/Interface/inotification';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-notifaction',
  imports: [DatePipe , CommonModule],
  templateUrl: './notifaction.html',
  styleUrl: './notifaction.scss'
})
export class Notifaction {


  isOpen = false;
  selected = signal<'All Notifaction' | 'Read' | 'Unread'>('All Notifaction');

  options = ['All Notifaction', 'Read', 'Unread'];

  private notificationService = inject(NotificationService);
  private _router = inject(Router);

  // 💥 الفلترة المظبوطة
  filteredNotifications = computed(() => {
    const filter = this.selected();
    const list = this.notificationService.notifications();

    if (filter === 'Read') {
      return list.filter(n => n.isRead === true);
    } 
    if (filter === 'Unread') {
      return list.filter(n => n.isRead === false);
    }
    return list;
  });

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selected.set(option as any);
    this.isOpen = false;
  }

  ngOnInit(): void {
    this.notificationService.getAllNotifications().subscribe(res => {
      if (res.success) {
        this.notificationService.notifications.set(res.value);
      }
    });

    this.notificationService.startConnection();
  }
mark(item: INotification) {
  this.notificationService.markAsRead(item.id).subscribe(() => {
    item.isRead = true;  
    this.notificationService.notifications.update(list => [...list]);

    this.navigateToType(item);
  });
}
  slots = [
  '12:00 PM - 12:30 PM',
  '12:30 PM - 1:00 PM',
  '1:30 PM - 2:00 PM',
  '2:00 PM - 2:30 PM',
  '2:30 PM - 3:00 PM',
  '3:00 PM - 3:30 PM',
  '3:30 PM - 4:00 PM',
  '4:00 PM - 4:30 PM'
];

formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
  return `${day}, ${month}`;
}

navigateToType(item: INotification) {
  const userType = localStorage.getItem('user_type'); 
  const userTypePrefix = userType ? userType.toLowerCase() : '';

  const prefix =
    userTypePrefix === 'admin' ? '' :
    userTypePrefix === 'employee' ? 'employee' :
    'client';

  switch (item.type) {

    case 0:
      this._router.navigate([`/${prefix}/projectDetails`, item.projectId]);
      break;

    case 1:
      this._router.navigate([`/${prefix}/projectDetails`, item.projectId]);
      break;

    case 2:
      this._router.navigate([`/${prefix}/projectDetails`, item.projectId]);
      break;

    case 3:
      this._router.navigate([`/${prefix}/projectDetails`, item.projectId]);
      break;

    default:
      break;
  }
}

}
