import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Employees } from '../../../Core/service/employees';
import { ActivatedRoute } from '@angular/router';
import { IEmployee } from '../../../Core/Interface/iemployee';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { AttendanceService } from '../../../Core/service/attendance.service.service';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { Myprojects } from "../myprojects/myprojects";
import { FeedbackEmployees } from "../feedback-employees/feedback-employees";

@Component({
  selector: 'app-myprofile',
  imports: [DatePipe, ReactiveModeuls, Myprojects, FeedbackEmployees],
  templateUrl: './myprofile.html',
  styleUrl: './myprofile.scss'
})
export class Myprofile {
  baseimageUrl = `${environment.baseimageUrl}`;

  private _Employees = inject(Employees);
  private _route = inject(ActivatedRoute);
  employeeId!: any;
aboutEmployees = signal<IEmployee | null>(null);
  private _Attendance = inject(AttendanceService);




  loadEmployeeData() {
    this._Employees.getMy().subscribe({
      next: (res) => {
        this.aboutEmployees.set(res.value);
        localStorage.setItem("Id_Employees", res.value.id.toString());
        this.employeeId = res.value.id.toString();
        this.loadEmployeeQr(res.value.id.toString());
      
      },
      error: (err) => {
      }
    });
  }



  
  qrImage = signal<string | null>(null);
  
    ngOnInit(): void {
        this.loadEmployeeData();

    }
    loadEmployeeQr(id: string) {

    this._Attendance.getEmployeeQr(id).subscribe({
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
