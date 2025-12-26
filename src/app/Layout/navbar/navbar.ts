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


isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}
     logout() {
    this._login.logout();
  }
}
