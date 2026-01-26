import { Component, inject, OnInit, signal } from '@angular/core';
import { Employees } from '../../../../Core/service/employees';
import { ReactiveModeuls } from '../../../../Shared/Modules/ReactiveForms.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlert } from '../../../../Core/service/sweet-alert';
import { IEmployee } from '../../../../Core/Interface/iemployee';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-editemployee',
  imports: [ReactiveModeuls],
  templateUrl: './editemployee.html',
  styleUrl: './editemployee.scss'
})
export class Editemployee  implements OnInit{
  createAccountForm: FormGroup;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;
  clientTitles = [ 'Rising Talent', 'Design Star', 'Top Tier', 'Maestro'];
  selectedClientTitle: string | null = null;
  employeeBadgeValue: number = 0;
  baseimageUrl = `${environment.baseimageUrl}`;

  private _Employees = inject(Employees);
  private _alert = inject(SweetAlert);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
isLoading = signal(false);

  employeeId!: any;

  constructor(private fb: FormBuilder) {
    this.createAccountForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      salary: [null, Validators.required],
      email: ['', Validators.required],
      password: ['',],
      username: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      const idParam = this._route.snapshot.paramMap.get('id');

    this.employeeId = idParam;
    if (this.employeeId) {
      this.loadEmployeeData();
    }
  }

  loadEmployeeData() {
    this._Employees.getById(this.employeeId).subscribe({
      next: (res) => {
        const emp = res.value as IEmployee;
        this.createAccountForm.patchValue({
          name: emp.name,
          title: emp.jobTitle,
          salary: emp.salary,
          email: emp.email,
          username: emp.userName,
          phoneNumber: emp.phoneNumber,


          password: '' 
        });
        this.imagePreview = emp.imageUrl;
        this.employeeBadgeValue = emp.employeeBadge;

        this.selectedClientTitle = this.clientTitles[emp.employeeBadge +1] || null;
      },
      error: (err) => {
        this._alert.toast('Failed to load employee data', 'error');
      }
    });
  }

isFromApi = true; 
onImageChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;
    this.imagePreview = URL.createObjectURL(file);
    this.isFromApi = false;
  }
}

  /** 🏅 Select Client Title */
  selectClientTitle(title: string) {
    this.selectedClientTitle = this.selectedClientTitle === title ? null : title;

    switch (this.selectedClientTitle) {
      case 'Rising Talent':
        this.employeeBadgeValue = 1;
        break;
      case 'Design Star':
        this.employeeBadgeValue = 2;
        break;
      case 'Top Tier':
        this.employeeBadgeValue = 3;
        break;
      case 'Maestro':
        this.employeeBadgeValue = 4;
        break;
      default:
        this.employeeBadgeValue = 0;
    }
  }

  onSubmit() {
    if (!this.createAccountForm.valid) {
      this._alert.toast('Please fill all required fields', 'warning');
      return;
    }

    this.isLoading.set(true);
    const formData = new FormData();
    if (this.selectedImageFile) formData.append('ImageFile', this.selectedImageFile);
    formData.append('Id', String(this.employeeId));
    formData.append('Name', this.createAccountForm.value.name);
    formData.append('JobTitle', this.createAccountForm.value.title);
    formData.append('Salary', this.createAccountForm.value.salary);
    formData.append('EmployeeBadge', String(this.employeeBadgeValue));
    formData.append('Email', this.createAccountForm.value.email);
    formData.append('UserName', this.createAccountForm.value.username);
    formData.append('PhoneNumber', this.createAccountForm.value.phoneNumber);

    this._Employees.update(this.employeeId, formData).subscribe({
      next: () => {
        this._alert.toast('Employee updated successfully ✅', 'success');
        this._router.navigate(['/home']);
        this.isLoading.set(false);
      },
      error: (err) => {
        this._alert.toast(err.error.detail, 'error');
        this.isLoading.set(false);
      }
    });
  }
}
