import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IService } from '../../Core/Interface/iservice';
import { SweetAlert } from '../../Core/service/sweet-alert';
import { Router, RouterLink } from '@angular/router';
import { ServiceApi } from '../../Core/service/serviceapi';

@Component({
  selector: 'app-service',
  imports: [DatePipe , RouterLink , CommonModule],
  templateUrl: './service.html',
  styleUrl: './service.scss'
})
export class Service {
  private _ServiceApi = inject(ServiceApi);
  private _alert = inject(SweetAlert);
  private _router = inject(Router);

 services = signal<IService[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._ServiceApi.getAll({ pageNumber: 1,pageSize: 100}).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success && Array.isArray(res.value)) {
          const withDates = res.value.map((s) => ({
            ...s,
          }));
          this.services.set(withDates);
        } else {
          this.services.set([]);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('❌ Error fetching services:', err);
            this._alert.toast(err.error.detail, 'error');
      }
    });
  }

  onDelete(service: IService, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this._alert
      .confirm(`Are you sure you want to delete ${service.name}?`, 'Confirm Delete')
      .then((result) => {
        if (result.isConfirmed) {
          this._ServiceApi.delete(service.id).subscribe({
            next: () => {
              this._alert.toast('Service deleted successfully.', 'success');
              this.services.update((list) => list.filter((s) => s.id !== service.id));
            },
            error: (err) => {
              console.error('❌ Delete error:', err);
            this._alert.toast(err.error.detail, 'error');
            }
          });
        }
      });
  }

  onEdit(service: IService, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log(service)
    this._router.navigate(['/editservice', service.id]);
  }
}
