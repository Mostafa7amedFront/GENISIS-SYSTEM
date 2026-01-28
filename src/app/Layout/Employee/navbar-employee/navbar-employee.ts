import { Component, inject } from '@angular/core';
import { LoginService } from '../../../Core/service/login';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
@Component({
  selector: 'app-navbar-employee',
  imports: [ReactiveModeuls],
  templateUrl: './navbar-employee.html',
  styleUrl: './navbar-employee.scss'
})
export class NavbarEmployee {
  _login = inject(LoginService);
  notifCount: number = 10;
  isMenuOpen: boolean = false;
  constructor() {}

  ngOnInit(): void {

  }



     logout() {
    this._login.logout();
  }
}
