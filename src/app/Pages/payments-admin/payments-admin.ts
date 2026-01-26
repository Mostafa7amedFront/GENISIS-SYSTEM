import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { PaymentsService } from '../../Core/service/Clients/payments.service';
import { IPayments } from '../../Core/Interface/ipayments';
import { CommonModule } from '@angular/common';
import { PaymentAdminService } from '../../Core/service/payment-admin.service';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';
import { SweetAlert } from '../../Core/service/sweet-alert';

@Component({
  selector: 'app-payments-admin',
  imports: [ReactiveModeuls],
  templateUrl: './payments-admin.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './payments-admin.scss'
})
export class PaymentsAdmin {
displayedMonths: { label: string; date: Date }[] = [];
  nextPaymentDate: string = '';
  selectedIndex = 4;
  payments = signal<IPayments[]>([]);
  private _alert = inject(SweetAlert);

  constructor(private _payments: PaymentAdminService) {}
paymentSound = new Audio(
  '/Sound/cashier-quotka-chingquot-sound-effect-129698.mp3'
);
  ngOnInit() {
    const currentDate = new Date();
    this.generateMonths(currentDate);
    this.loadPayments(this.displayedMonths[this.selectedIndex].date);
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

  this.selectedIndex = this.displayedMonths.findIndex(m =>
    m.date.getMonth() === selectedDate.getMonth() &&
    m.date.getFullYear() === selectedDate.getFullYear()
  );


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
    this._payments.getPayments(isoDate).subscribe({
      next: (res) => {
        this.payments.set(res.value)  
      },
      error: (err) => {
        this.payments.set([])  
      }
    });
  }
  paidPayments() {
  return this.payments().filter(p => p.isPaid);
}

unPaidPayments() {
  return this.payments().filter(p => !p.isPaid);
}


  togglePaymentStatus(payment: IPayments) {
  const newValue = !payment.isPaid;

  payment.isPaid = newValue;

  this._payments.togglePayment(payment.id, newValue).subscribe({
    next: res => {
  
           this.paymentSound.currentTime = 0;
              this.paymentSound.play();

      this._alert.toast(
        newValue ? 'Payment marked as Paid.' : 'Payment marked as Unpaid.',
        'success'
      );
    },
    error: err => {
      this._alert.toast(err.error.detail, 'error');

      payment.isPaid = !newValue;
    }
  });

}
}
