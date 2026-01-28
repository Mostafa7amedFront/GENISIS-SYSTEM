import { Component, inject, signal, effect } from '@angular/core';
import { LoginService } from '../../../Core/service/login';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { NotificationService } from '../../../Core/service/notification.service';

@Component({
  selector: 'app-navbar-employee',
  imports: [ReactiveModeuls],
  templateUrl: './navbar-employee.html',
  styleUrl: './navbar-employee.scss',
})
export class NavbarEmployee {
  _login = inject(LoginService);
  _notification = inject(NotificationService);

  notifCount = signal<number>(0);
  isMenuOpen = false;

  // ✅ effect هنا (Injection Context)
  private syncCount = effect(() => {
    this.notifCount.set(this._notification.unreadCount());
  });

  constructor() {}

  ngOnInit(): void {
    // ✅ تحميل العدد أول مرة
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
