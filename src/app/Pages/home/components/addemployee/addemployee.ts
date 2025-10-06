import { Employees } from './../../../../Core/service/employees';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SweetAlert } from '../../../../Core/service/sweet-alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addemployee.html',
  styleUrls: ['./addemployee.scss']
})
export class Addemployee {
  createAccountForm: FormGroup;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;
  clientTitles = ['Rising Talent', 'Desgin Star','Top Tier', 'Maestro'];
  selectedClientTitle: string | null = null;
  employeeBadgeValue: number = 0;
  private Employees = inject(Employees);
  private _alert = inject(SweetAlert); 
  private _router = inject(Router);

  constructor(private fb: FormBuilder, private _http: HttpClient) {
    this.createAccountForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      salary: [null, Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required]
    });
  }

onImageChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;
    this.imagePreview = URL.createObjectURL(file);
  }
}
  selectClientTitle(title: string) {
    this.selectedClientTitle = this.selectedClientTitle === title ? null : title;

    switch (this.selectedClientTitle) {
      case 'Rising Talent':
        this.employeeBadgeValue = 0;
        break;
      case 'Design Star':
        this.employeeBadgeValue = 1;
        break;
      case 'Top Tier':
        this.employeeBadgeValue = 2;
        break;
      case 'Maestro':
        this.employeeBadgeValue = 3;
        break;
      default:
        this.employeeBadgeValue = 0;
    }

  }

  onSubmit() {
    if (!this.createAccountForm.valid || !this.selectedImageFile) {
      this._alert.toast('Please fill all required fields and upload an image.' , 'warning');
      return;
    }
    const formData = new FormData();
    formData.append('ImageFile', this.selectedImageFile);
    formData.append('Name', this.createAccountForm.value.name);
    formData.append('JobTitle', this.createAccountForm.value.title);
    formData.append('Salary', this.createAccountForm.value.salary);
    formData.append('EmployeeBadge', String(this.employeeBadgeValue)); 
    formData.append('Email', this.createAccountForm.value.email);
    formData.append('Password', this.createAccountForm.value.password);
    formData.append('UserName', this.createAccountForm.value.username);

    this.Employees.add(formData).subscribe({
       next: (res) => {
        console.log('✅ Employee added:', res);
        this._alert.toast('Employee added successfully 🎉', 'success');
        this.createAccountForm.reset();
        this.imagePreview = null;
        this.selectedImageFile = null;
        this.employeeBadgeValue = 0;
                this._router.navigate(['/home']);

      },
      error: (err) => {
        console.error('❌ Error:', err);
        if (err.status === 503) {
          this._alert.toast('Service temporarily unavailable (503). Try again later.' , 'error');
        } else {
          this._alert.toast('An unexpected error occurred. Please check the console.', 'error');
        }
      }
    });
  
  }
}
