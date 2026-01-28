import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../Core/service/login';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';
import { NotificationService } from '../../Core/service/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule  , ReactiveModeuls],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  _login = inject(LoginService);
  _notification = inject(NotificationService);
userType = signal<string>('');

  notifCount = signal<number>(0);
  isMenuOpen = false;


  private syncCount = effect(() => {
    this.notifCount.set(this._notification.unreadCount());
  });

  constructor() {}

  ngOnInit(): void {
    this._notification.loadUnreadCount();

    this._notification.startConnection();
      const type = localStorage.getItem('user_type');
  this.userType.set((type ?? '').toLowerCase());
  }
isAdmin(): boolean {
  return this.userType() === 'Admin';
}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this._login.logout();
  }
}
