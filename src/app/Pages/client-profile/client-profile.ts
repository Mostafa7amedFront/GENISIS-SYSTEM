import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FeedbackProfile } from '../projects/feedback-profile/feedback-profile';
import { ProjectsProfile } from '../projects/projects-profile/projects-profile';
import { environment } from '../../../environments/environment';
import { Clients } from '../../Core/service/clients';
import { ActivatedRoute } from '@angular/router';
import { IClients } from '../../Core/Interface/iclients';
import { FeedbackClient } from "./Components/feedback-client/feedback-client";


@Component({
  selector: 'app-client-profile',
  imports: [ProjectsProfile, FeedbackClient ,  DatePipe,UpperCasePipe],
  templateUrl: './client-profile.html',
  styleUrl: './client-profile.scss'
})
export class ClientProfile {
  baseimageUrl = `${environment.baseimageUrl}`;

  private _client = inject(Clients);
  private _route = inject(ActivatedRoute);
  clientId!: any;
aboutclient = signal<IClients | null>(null);


  ngOnInit(): void {
      const idParam = this._route.snapshot.paramMap.get('id');

    this.clientId = idParam;
    if (this.clientId) {
      this.loadEmployeeData();
    }
  }
formatClientDate(date: any): string {
  const d = new Date(date);

  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  const suffix =
    day % 10 === 1 && day !== 11 ? 'ST' :
    day % 10 === 2 && day !== 12 ? 'ND' :
    day % 10 === 3 && day !== 13 ? 'RD' :
    'TH';

  return `${day}${suffix}, ${month}`;
}

  loadEmployeeData() {
    this._client.getById(this.clientId).subscribe({
      next: (res) => {
        this.aboutclient.set(res.value)
      
      },
      error: (err) => {
      }
    });
  }
getEmployeesFirstNames(): string {
  const employees = this.aboutclient()?.employeesAssignedToClient ?? [];

  return employees
    .map(e => e.name.split(/[\s_]+/)[0]) // الاسم الأول
    .join(' - '); // dash بين الأسماء
}

  
}
