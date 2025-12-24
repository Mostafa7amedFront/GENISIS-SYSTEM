import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';
import { SidebarEmployee } from '../sidebar-employee/sidebar-employee';
import { NavbarEmployee } from "../navbar-employee/navbar-employee";

@Component({
  selector: 'app-mainlayout-employee',
  imports: [RouterOutlet, NavbarEmployee],
  templateUrl: './mainlayout-employee.html',
  styleUrl: '../../main-outlet/main-outlet.scss'
})
export class MainlayoutEmployee {
  isSidebarClosed = false;

  onToggleSidebar(closed: boolean) {
    this.isSidebarClosed = closed;
  }
}
