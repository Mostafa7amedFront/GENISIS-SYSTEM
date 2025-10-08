import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Clients } from '../../Core/service/clients';
import { SweetAlert } from '../../Core/service/sweet-alert';
import { environment } from '../../../environments/environment';
import { IClients } from '../../Core/Interface/iclients';
interface Project {
  id: number;
  tag: string;
  image: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  status: string;
}


@Component({
  selector: 'app-client',
  imports: [CommonModule, RouterModule],
  templateUrl: './client.html',
  styleUrl: './client.scss'
})
export class Client {
  isOpen = false;
options = [
  { label: 'ALL CLIENTS', value: 0 },
  { label: 'COMPLETED', value: 1 },
  { label: 'IN PROGRESS', value: 2 },
  { label: 'PAUSED', value: 3 }
];

  selected = this.options[0]; // الافتراضي ALL CLIENTS



toggleMenu() {
  this.isOpen = !this.isOpen;
}

selectOption(option: any) {
  this.selected = option;
  this.isOpen = false;
  this.loadEmployees(); // إعادة تحميل البيانات بناءً على الخيار الجديد
}


  
  private _Clients = inject(Clients);
  today = new Date();
  isLoading = signal(false);
  errorMessage = signal('');
  private _alert = inject(SweetAlert);
  private routes  = inject(Router);
  baseimageUrl = `${environment.baseimageUrl}`;
  projects = signal<IClients[]>([]);

  ngOnInit(): void {
    this.loadEmployees();
  }

loadEmployees(): void {
  this.isLoading.set(true);
  this.errorMessage.set('');

  this._Clients.getAll({
    pageNumber: 1,
    pageSize: 50,
    ProjectStatus: this.selected.value
  }).subscribe({
    next: (response) => {
      this.isLoading.set(false);

      if (response.success && response.value.length > 0) {
        this.projects.set(response.value);
      } else {
        this.projects.set([]);
      }
    },
    error: (err) => {
      this.isLoading.set(false);

      if (err.status === 503) {
        this.errorMessage.set('Service is temporarily unavailable (503). Please try again later.');
      } else if (err.status === 0) {
        this.errorMessage.set('Cannot connect to the server. Please check your internet connection.');
      } else {
        this.errorMessage.set('An unexpected error occurred while loading data.');
      }

      console.error('Error fetching employees:', err);
    }
  });
}

  onDelete(card: IClients, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this._alert.confirm(`Are you sure you want to delete ${card.name}?`, 'Confirm Delete')
      .then((result) => {
        if (result.isConfirmed) {
          this._Clients.delete(card.id).subscribe({
            next: (res) => {
              console.log('✅ Deleted:', res);
              this._alert.toast('Employee deleted successfully.', 'success');
              this.projects.update((list) => list.filter(e => e.id !== card.id));
            },
            error: (err) => {
              console.error('❌ Delete error:', err);
            this._alert.toast(err.error.detail, 'error');
            }
          });
        }
      });
  }

  onEdit(card: any, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Edit clicked', card);
    this.routes.navigate(['/editemployee', card.id]);
  }

   
}
