import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback-profile',
  imports: [CommonModule],
  templateUrl: './feedback-profile.html',
  styleUrl: './feedback-profile.scss'
})
export class FeedbackProfile {
  isOpen = false;
  selected = 'ALL CLIENTS';
  options = ['ALL CLIENTS', 'COMPLETED', 'IN PROGRESS', 'PAUSED'];

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selected = option;
    this.isOpen = false;
  }

}
