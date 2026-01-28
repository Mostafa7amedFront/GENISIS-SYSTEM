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
userId = localStorage.getItem('Id_Clients') || '';
  selectedIndex = 4;
  payments = signal<IPayments[]>([]);

  constructor(private _payments: PaymentsService) {}

  ngOnInit() {
    const currentDate = new Date();
      this.userId = localStorage.getItem('clientId') || '';

    this.generateMonths(currentDate);
    this.loadPayments(this.displayedMonths[this.selectedIndex].date);
  }

    paidPayments() {
  return this.payments().filter(p => !p.isPaid);
}

unPaidPayments() {
  return this.payments().filter(p => p.isPaid);
}


  generateMonths(selectedDate: Date) {
  this.displayedMonths = [];

  const startYear = selectedDate.getFullYear();
  const totalMonths = 24;

  for (let i = 0; i < totalMonths; i++) {
    const date = new Date(startYear, i, 1);
  date.setFullYear(startYear, i, 3); 
  date.setHours(0, 0, 0, 0); 
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
        this.payments.set([])  
      }
    });
  }
}
