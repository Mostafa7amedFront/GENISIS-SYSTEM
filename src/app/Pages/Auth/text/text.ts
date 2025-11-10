import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';

@Component({
  selector: 'app-text',
  imports: [CommonModule , ReactiveModeuls],
  templateUrl: './text.html',
  styleUrl: './text.scss'
})
export class Text {
  @Input() total = 0;

  isOpen = true;
  active:any = null;

  // نموذج وهمي للبطاقة
  card = {
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  };

  open() {
    this.isOpen = true;
    this.active = null; // يبدأوا مقفولين
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  toggle(key: any) {
    this.active = this.active === key ? null : key;
  }

  isActive(key: any) {
    return this.active === key;
  }

  payCard() {
    // نفّذي عملية الدفع الفعلية هنا
    alert(`Processing card payment: ${this.total}`);
  }

}
