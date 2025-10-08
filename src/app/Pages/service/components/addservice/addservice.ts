import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveModeuls } from '../../../../Shared/Modules/ReactiveForms.module';
import { ServiceApi } from '../../../../Core/service/serviceapi';
import { SweetAlert } from '../../../../Core/service/sweet-alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addservice',
  imports: [ReactiveModeuls],
  templateUrl: './addservice.html',
  styleUrl: './addservice.scss'
})
export class Addservice {
  private _fb = inject(FormBuilder);
  private _ServiceApi = inject(ServiceApi);
  private _alert = inject(SweetAlert);
  private _router = inject(Router);

  addServiceForm = this._fb.group({
    name: ['', Validators.required],
  });

  isSubmitting = false;

  onSubmit() {
    if (this.addServiceForm.invalid) {
      this._alert.toast('Please fill in all required fields.', 'warning');
      this.addServiceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.addServiceForm.value;

    this._ServiceApi.add(this.addServiceForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this._alert.toast('Service added successfully!', 'success');
          this._router.navigate(['/service']);
        } else {
          this._alert.toast('Failed to add service.', 'error');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('❌ Add error:', err);
            this._alert.toast(err.error.detail, 'error');
      }
    });
  }
}
