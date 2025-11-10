import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { PaymentsService } from '../../../Core/service/Clients/payments.service';
import { IPayments } from '../../../Core/Interface/ipayments';

@Component({
  selector: 'app-payments',
  imports: [CommonModule],
  templateUrl: './payments.html',
  styleUrl: './payments.scss'
})
export class Payments {
 displayedMonths: { label: string; date: Date }[] = [];
  nextPaymentDate: string = '';
  userId = 'aaf8fddf-305b-4218-b04e-9c0f9deb64c0';
  selectedIndex = 4;
  payments = signal<IPayments[]>([]);

  constructor(private _payments: PaymentsService) {}

  ngOnInit() {
    const currentDate = new Date();
    this.generateMonths(currentDate);
    this.loadPayments(this.displayedMonths[this.selectedIndex].date);
  }

  generateMonths(selectedDate: Date) {
    this.displayedMonths = [];
    for (let i = -4; i < 4; i++) {
      const date = new Date(selectedDate);
      date.setMonth(selectedDate.getMonth() + i);
      this.displayedMonths.push({
        label: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
        date
      });
    }

    const nextDate = new Date(selectedDate);
    nextDate.setMonth(selectedDate.getMonth() + 1);
    this.nextPaymentDate = nextDate
      .toLocaleString('default', { day: 'numeric', month: 'short' })
      .toUpperCase();
  }

  selectMonth(index: number) {
    this.selectedIndex = index;
    const selectedDate = this.displayedMonths[index].date;
    this.loadPayments(selectedDate);
  }

  loadPayments(date: Date) {
    const isoDate = date.toISOString();
    this._payments.getPayments(this.userId, isoDate).subscribe({
      next: (res) => {
        this.payments.set(res.value)  
      },
      error: (err) => {
        console.error(err);
        this.payments.set([])  
      }
    });
  }
}
