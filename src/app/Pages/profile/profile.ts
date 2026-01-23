import { Component, inject, OnInit, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Employees } from '../../Core/service/employees';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IEmployee } from '../../Core/Interface/iemployee';
import { DatePipe, UpperCasePipe, NgClass } from '@angular/common';
import { FeedbackProfile } from '../projects/feedback-profile/feedback-profile';
import { ProjectsProfile } from '../projects/projects-profile/projects-profile';
import { AddFeedbackEmployee } from '../add-feedback-employee/add-feedback-employee';
import { FeedbackEmployees } from './Components/feedback-employees/feedback-employees';
import { ArrivalTime } from './Components/arrival-time/arrival-time';
import { AttendanceService } from '../../Core/service/attendance.service.service';

@Component({
  selector: 'app-profile',
  imports: [ProjectsProfile, DatePipe, RouterLink, FeedbackEmployees, ArrivalTime, NgClass],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  baseimageUrl = `${environment.baseimageUrl}`;

  private _Employees = inject(Employees);
  private _route = inject(ActivatedRoute);
  private _Attendance = inject(AttendanceService);
  employeeId!: any;
  aboutEmployees = signal<IEmployee | null>(null);
qrImage = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this._route.snapshot.paramMap.get('id');

    this.employeeId = idParam;
    if (this.employeeId) {
      this.loadEmployeeData();
    }
  }
  loadEmployeeQr() {
  if (!this.employeeId) return;

  this._Attendance.getEmployeeQr(this.employeeId).subscribe({
    next: (res) => {
      if (res.success) {
        this.qrImage.set(`data:image/png;base64,${res.value}`);
      }
    },
    error: () => {
      console.error('Failed to load QR code');
    }
  });
}


  loadEmployeeData() {
    this._Employees.getById(this.employeeId).subscribe({
      next: (res) => {
        this.aboutEmployees.set(res.value);
         this.loadEmployeeQr();
      },
      error: (err) => {},
    });
  }
  calculateRatePercentage(): number {
    const rate = this.aboutEmployees()?.feedback?.feedbackRate ?? 0;
    return Math.round((rate / 5) * 100);
  }
  getFeedbackMonth(): string {
    const date = this.aboutEmployees()?.feedback?.createdAt;

    if (!date) return 'NO FEEDBACK FOR THIS MONTH';

    return new Date(date).toLocaleString('en-US', { month: 'long' }).toUpperCase();
  }

  downloadQr() {
  const qr = this.qrImage();
  if (!qr) return;

  // تحويل base64 إلى Blob
  const base64Data = qr.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  // إنشاء link وهمي للتحميل
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `employee-qr-${this.employeeId}.png`;
  a.click();

  window.URL.revokeObjectURL(url);
}

}
