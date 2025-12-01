import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';
import { SidebarEmployee } from '../sidebar-employee/sidebar-employee';

@Component({
  selector: 'app-mainlayout-employee',
  imports: [RouterOutlet, SidebarEmployee],
  templateUrl: './mainlayout-employee.html',
  styleUrl: '../../main-outlet/main-outlet.scss'
})
export class MainlayoutEmployee {
  isSidebarClosed = false;

  onToggleSidebar(closed: boolean) {
    this.isSidebarClosed = closed;
  }
}
