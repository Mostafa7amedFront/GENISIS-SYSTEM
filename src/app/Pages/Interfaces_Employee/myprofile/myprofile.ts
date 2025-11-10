import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Employees } from '../../../Core/service/employees';
import { ActivatedRoute } from '@angular/router';
import { IEmployee } from '../../../Core/Interface/iemployee';
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-myprofile',
  imports: [DatePipe ,UpperCasePipe  ],
  templateUrl: './myprofile.html',
  styleUrl: './myprofile.scss'
})
export class Myprofile {
  baseimageUrl = `${environment.baseimageUrl}`;

  private _Employees = inject(Employees);
  private _route = inject(ActivatedRoute);
  employeeId!: any;
aboutEmployees = signal<IEmployee | null>(null);


ngOnInit(): void {
    this.loadEmployeeData();

}

  loadEmployeeData() {
    this._Employees.getMy().subscribe({
      next: (res) => {
        console.log(res.value)
        this.aboutEmployees.set(res.value)
        localStorage.setItem("Id_Employees", res.value.id.toString());
      
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
