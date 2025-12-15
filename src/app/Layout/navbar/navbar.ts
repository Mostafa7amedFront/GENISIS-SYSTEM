import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../Core/service/login';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  _login = inject(LoginService);



     logout() {
    this._login.logout();
  }
}
