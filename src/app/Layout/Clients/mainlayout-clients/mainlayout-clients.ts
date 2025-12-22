import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';
import { SidebarCliens } from '../sidebar-cliens/sidebar-cliens';
import { Navbar } from "../../navbar/navbar";
import { NavbarClients } from "../navbar-clients/navbar-clients";

@Component({
  selector: 'app-mainlayout-clients',
  imports: [RouterOutlet, NavbarClients],
  templateUrl: './mainlayout-clients.html',
  styleUrl: './mainlayout-clients.scss'
})
export class MainlayoutClients {
  isSidebarClosed = false;

  onToggleSidebar(closed: boolean) {
    this.isSidebarClosed = closed;
  }
}
