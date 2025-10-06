import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';

@Component({
  selector: 'app-sidebar',
  imports: [ReactiveModeuls],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  @Output() toggleSidebar = new EventEmitter<boolean>();

  isClosed = true;

  projects = [
    { name: 'Website Redesign', count: 5 },
    { name: 'Brand Refresh', count: 3 },
    { name: 'Hiring Campaign', count: 2 },
  ];

  toggle() {
    this.isClosed = !this.isClosed;
    this.toggleSidebar.emit(!this.isClosed);
  }
}
