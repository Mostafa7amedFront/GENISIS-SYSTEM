import { Component, inject } from '@angular/core';
import { LoginService } from '../../../Core/service/login';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';

@Component({
  selector: 'app-navbar-clients',
  imports: [ReactiveModeuls],
  templateUrl: './navbar-clients.html',
  styleUrl: './navbar-clients.scss'
})
export class NavbarClients {
  _login = inject(LoginService);



     logout() {
    this._login.logout();
  }
}
