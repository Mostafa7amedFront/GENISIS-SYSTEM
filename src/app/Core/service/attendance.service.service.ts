import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QrResponse, ScanAttendanceResponse, WeeklyAttendanceResponse } from '../Interface/iattendance';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  
  private apiUrl = `${environment.apiUrl}Attendance`;

  constructor(private http: HttpClient) {}

  getEmployeeQr(employeeId: string): Observable<QrResponse> {
    return this.http.get<QrResponse>(
      `${this.apiUrl}/qr/${employeeId}`
    );
  }
    scanAttendance(employeeId: string): Observable<ScanAttendanceResponse> {
    return this.http.post<ScanAttendanceResponse>(
      `${this.apiUrl}/scan/${employeeId}`,
      {}
    );
  }


  
  getWeeklyAttendance(employeeId: string, date: Date, weekNumber: number): Observable<WeeklyAttendanceResponse> {
    const params = new HttpParams()
      .set('EmployeeId', employeeId)
      .set('Date', date.toISOString())   // e.g. 2026-01-23T00:00:00.000Z
      .set('WeekNumber', weekNumber);

    return this.http.get<WeeklyAttendanceResponse>(`${this.apiUrl}/GetWeeklyAttendance`, { params });
  }
}
