import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceApi } from '../../../../Core/service/serviceapi';
import { ActivatedRoute, Router } from '@angular/router';
import { IService } from '../../../../Core/Interface/iservice';
import { ReactiveModeuls } from '../../../../Shared/Modules/ReactiveForms.module';
import { SweetAlert } from '../../../../Core/service/sweet-alert';

@Component({
  selector: 'app-editservice',
  imports: [ReactiveModeuls],
  templateUrl: './editservice.html',
  styleUrl: './editservice.scss'
})
export class Editservice {
  serviceForm!: FormGroup;
  serviceId!: any;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private _service: ServiceApi,
    private route: ActivatedRoute,
    private router: Router,
    private _alert :SweetAlert
  ) {}

  ngOnInit(): void {
    this.serviceId =  this.route.snapshot.paramMap.get('id');
   
    this.serviceForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.loadService();
  }

  loadService(): void {
    
    this._service.getById(this.serviceId).subscribe({
      next: (res) => {
        this.serviceForm.patchValue(res.value);
      },
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) return;

    const updatedService: IService = {
      ...this.serviceForm.value
    };
    (this.isLoading.set(true));

    this._service.update(this.serviceId, updatedService).subscribe({
      next: res => {
          this._alert.toast('Service updated  successfully!', 'success');
          this.router.navigate(['/service']);
          this.isLoading.set(false);
    // if (res.success) {
    //       this._alert.toast('Service updated  successfully!', 'success');
    //       this.router.navigate(['/service']);
    //     } else {
    //       this._alert.toast('Failed to updated  service.', 'error');
    //     }
      },
      error: (err) => {
            this._alert.toast(err.error.detail, 'error');
            this.isLoading.set(false);
      }
      
    });
  }
}
