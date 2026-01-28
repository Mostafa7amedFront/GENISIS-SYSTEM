import { Component, effect, inject, signal } from '@angular/core';
import { LoginService } from '../../../Core/service/login';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { NotificationService } from '../../../Core/service/notification.service';

@Component({
  selector: 'app-navbar-clients',
  imports: [ReactiveModeuls],
  templateUrl: './navbar-clients.html',
  styleUrl: './navbar-clients.scss'
})
export class NavbarClients {
  _login = inject(LoginService);
  _notification = inject(NotificationService);

  notifCount = signal<number>(0);
  isMenuOpen = false;

  private syncCount = effect(() => {
    this.notifCount.set(this._notification.unreadCount());
  });

  constructor() {}

  ngOnInit(): void {
    // ✅ تحميل  أول مرة
    this._notification.loadUnreadCount();
    // ✅ SignalR
    this._notification.startConnection();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this._login.logout();
  }
}
