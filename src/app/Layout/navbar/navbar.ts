import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../Core/service/login';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule  , ReactiveModeuls],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  _login = inject(LoginService);



  // 🔔 عدد الإشعارات
  notifCount: number = 0;

  // Menu Mobile
  isMenuOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // مثال: تحميل الإشعارات أول ما الصفحة تفتح
    this.getNotificationsCount();
  }

  // ✅ Function تجيب عدد الإشعارات
  getNotificationsCount() {
    // حاليا رقم تجريبي
    this.notifCount = 5;

    // بعدين لما تربط API هتبقى كده مثلا:
    /*
    this.notificationService.getCount().subscribe((res:any) => {
      this.notifCount = res.count;
    });
    */
  }

  // ✅ Toggle Menu للموبايل
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // ✅ Logout Function
  logout() {
    this._login.logout();
  }
}
