import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Clients } from '../../Core/service/clients';
import { SweetAlert } from '../../Core/service/sweet-alert';
import { environment } from '../../../environments/environment';
import { IClients } from '../../Core/Interface/iclients';
import { ShortenPipe } from '../../Shared/pipes/shorten-pipe';
import { LeadingZeroPipe } from '../../Shared/pipes/leading-zero-pipe';


@Component({
  selector: 'app-client',
  imports: [CommonModule, RouterModule, ShortenPipe , LeadingZeroPipe],
  templateUrl: './client.html',
  styleUrl: './client.scss'
})
export class Client {
  isOpen = false;
options = [
  { label: 'ALL CLIENTS', value: null },
  { label: 'OLD CLIENT', value: 0 },
  { label: 'LONG TERM', value: 1 },
  { label: 'NEW CLIENT', value: 2 }
];

  selected = this.options[0];



  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.selected = option;
    this.isOpen = false;
    this.loadEmployees();
  }



  private _Clients = inject(Clients);
  today = new Date();
  isLoading = signal(false);
  errorMessage = signal('');
  private _alert = inject(SweetAlert);
  private routes = inject(Router);
  baseimageUrl = `${environment.baseimageUrl}`;
  projects = signal<IClients[]>([]);


getProjectCounts() {
  const oldClient = this.projects().filter(p => p.clientType === 0).length;
  const longTerm = this.projects().filter(p => p.clientType === 1).length;
  const newClient = this.projects().filter(p => p.clientType === 2).length;
  return { oldClient, longTerm, newClient };
}
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
    this.routes.navigate(['/editclient', card.id]);
  }


}
