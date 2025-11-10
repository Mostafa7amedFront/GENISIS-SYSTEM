import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { LoginService } from '../../../Core/service/login';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-cliens',
  imports: [RouterLink , RouterLinkActive],
  templateUrl: './sidebar-cliens.html',
  styleUrl: '../../sidebar/sidebar.scss'
})
export class SidebarCliens {
  @Output() toggleSidebar = new EventEmitter<boolean>();
  _login = inject(LoginService);

  isClosed = true;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
      }
    });
  }
  projects = [
    { name: 'Website Redesign', count: 5 },
    { name: 'Brand Refresh', count: 3 },
    { name: 'Hiring Campaign', count: 2 },
  ];

  toggle() {
    this.isClosed = !this.isClosed;
    this.toggleSidebar.emit(!this.isClosed);
  }
   logout() {
    this._login.logout();
  }

  isMobileMenuOpen = false;

toggleMobileMenu() {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

}
