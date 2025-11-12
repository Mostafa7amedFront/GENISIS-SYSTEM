import { Component, inject, signal } from '@angular/core';
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
  styleUrl: './payments-admin.scss'
})
export class PaymentsAdmin {
displayedMonths: { label: string; date: Date }[] = [];
  nextPaymentDate: string = '';
  userId = 'aaf8fddf-305b-4218-b04e-9c0f9deb64c0';
  selectedIndex = 4;
  payments = signal<IPayments[]>([]);
  private _alert = inject(SweetAlert);

  constructor(private _payments: PaymentAdminService) {}

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
    this._payments.getPayments(isoDate).subscribe({
      next: (res) => {
        this.payments.set(res.value)  
      },
      error: (err) => {
        console.error(err);
        this.payments.set([])  
      }
    });
  }

  togglePaymentStatus(payment: IPayments) {
  const newValue = !payment.isPaid;

  payment.isPaid = newValue;

  this._payments.togglePayment(payment.id, newValue).subscribe({
    next: res => {
      console.log('✅ Payment toggled:', res);
      this._alert.toast(
        newValue ? 'Payment marked as Paid.' : 'Payment marked as Unpaid.',
        'success'
      );
    },
    error: err => {
      console.error('❌ Error toggling payment:', err);
      this._alert.toast('Failed to update payment status.', 'error');

      payment.isPaid = !newValue;
    }
  });

}
}
