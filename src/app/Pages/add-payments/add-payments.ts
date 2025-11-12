import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../Core/service/project.service';
import { SweetAlert } from '../../Core/service/sweet-alert';
import { MeetingService } from '../../Core/service/Clients/meeting.service';
import { environment } from '../../../environments/environment';
import { IProject } from '../../Core/Interface/iproject';
import { CommonModule } from '@angular/common';
import { PaymentAdminService } from '../../Core/service/payment-admin.service';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-payments',
  imports: [CommonModule , ReactiveModeuls, FormsModule],
  templateUrl: './add-payments.html',
  styleUrl: './add-payments.scss'
})
export class AddPayments {
private _project = inject(ProjectService);
  private _payment = inject(PaymentAdminService);
  private _alert = inject(SweetAlert);

  baseimageUrl = environment.baseimageUrl;

  // Signals
  projects = signal<IProject[]>([]);
  selectedProjectId = signal<string | null>(null);
  selectedDate = signal(new Date());
amount = signal<number | null>(null);

  currentDate = new Date();

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    const requestData = { pageNumber: 1, pageSize: 1000 };
    this._project.getAll(requestData).subscribe({
      next: res => {
        this.projects.set(res.success ? res.value : []);
      },
      error: err => console.error('❌ Error fetching projects:', err)
    });
  }

  selectProject(id: string) {
    this.selectedProjectId.set(id);
    console.log('Selected Project ID:', id);
  }

  get monthYear(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  }

  daysInMonth(): number[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }

  selectDate(day: number) {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    this.selectedDate.set(date);
  }

  isSelected(day: number): boolean {
    const sel = this.selectedDate();
    return sel.getDate() === day &&
      sel.getMonth() === this.currentDate.getMonth() &&
      sel.getFullYear() === this.currentDate.getFullYear();
  }

  addPayment() {
    const projectId = this.selectedProjectId();
    const amount = this.amount();
    const dateISO = this.selectedDate().toISOString();

if (!projectId) {
  this._alert.toast(' Please select a project first.', 'warning');
  return;
}

if (amount == null) {
  this._alert.toast(' Please enter the payment amount.', 'warning');
  return;
}

if (amount <= 0) {
  this._alert.toast(' Amount must be greater than 0.', 'warning');
  return;
}
    const data = { amount, dateTime: dateISO };
    console.log('Payment Data:', data);

    this._payment.addPayment(projectId, data).subscribe({
      next: res => {
        this._alert.toast('Payment added successfully!', 'success');
        this.clearSelection();
      },
      error: err => {
        console.error(err);
        this._alert.toast('Error adding payment.', 'error');
      }
    });
  }

  private clearSelection() {
    this.selectedProjectId.set(null);
    this.amount.set(null);
    this.selectedDate.set(new Date());
  }

}
