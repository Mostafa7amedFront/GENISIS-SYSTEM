import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';
import { SidebarCliens } from '../sidebar-cliens/sidebar-cliens';

@Component({
  selector: 'app-mainlayout-clients',
  imports: [RouterOutlet,  SidebarCliens],
  templateUrl: './mainlayout-clients.html',
  styleUrl: './mainlayout-clients.scss'
})
export class MainlayoutClients {
  isSidebarClosed = false;

  onToggleSidebar(closed: boolean) {
    this.isSidebarClosed = closed;
  }
}
