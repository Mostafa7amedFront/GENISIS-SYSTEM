import { Component, inject, OnInit, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Employees } from '../../Core/service/employees';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IEmployee } from '../../Core/Interface/iemployee';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { FeedbackProfile } from '../projects/feedback-profile/feedback-profile';
import { ProjectsProfile } from '../projects/projects-profile/projects-profile';
import { AddFeedbackEmployee } from "../add-feedback-employee/add-feedback-employee";
import { FeedbackEmployees } from './Components/feedback-employees/feedback-employees';

@Component({
  selector: 'app-profile',
  imports: [ProjectsProfile, DatePipe, UpperCasePipe, RouterLink, FeedbackEmployees],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  baseimageUrl = `${environment.baseimageUrl}`;

  private _Employees = inject(Employees);
  private _route = inject(ActivatedRoute);
  employeeId!: any;
aboutEmployees = signal<IEmployee | null>(null);


  ngOnInit(): void {
      const idParam = this._route.snapshot.paramMap.get('id');

    this.employeeId = idParam;
    if (this.employeeId) {
      this.loadEmployeeData();
    }
    console.log(this.employeeId)
  }

  loadEmployeeData() {
    this._Employees.getById(this.employeeId).subscribe({
      next: (res) => {
        console.log(res.value)
        this.aboutEmployees.set(res.value)
      
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


}
