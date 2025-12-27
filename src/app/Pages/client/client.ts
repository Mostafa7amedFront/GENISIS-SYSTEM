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
  imports: [CommonModule, RouterModule, LeadingZeroPipe],
  templateUrl: './client.html',
  styleUrl: './client.scss'
})
export class Client {
  isOpen = false;
    currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);
  hasPreviousPage = signal<boolean>(false);
  hasNextPage = signal<boolean>(false);
  pageSize = 12;

options = [
  { label: 'ALL TIME', value: null },
  { label: 'LAST MONTH', value: 1 },
  { label: 'LAST 3 MONTHS', value: 3 },
  { label: 'LAST 6 MONTHS', value: 6 },
  { label: 'LAST YEAR', value: 12 }
];


  selected = this.options[0];



  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.selected = option;
    this.isOpen = false;
  }



  private _Clients = inject(Clients);
  today = new Date();
  isLoading = signal(false);
  errorMessage = signal('');
  private _alert = inject(SweetAlert);
  private routes = inject(Router);
  baseimageUrl = `${environment.baseimageUrl}`;
  projects = signal<IClients[]>([]);
  selectedProjectType = signal<number | null>(null);


getProjectCounts() {
  const oldClient = this.projects().filter(p => p.clientType === 0).length;
  const longTerm = this.projects().filter(p => p.clientType === 1).length;
  const newClient = this.projects().filter(p => p.clientType === 2).length;
  return { oldClient, longTerm, newClient };
}
  ngOnInit(): void {
    this.loadEmployees();
  }
  selectProjectType(type: number) {
     if (this.selectedProjectType() === type) {
      this.selectedProjectType.set(null);
    } else {
      this.selectedProjectType.set(type);
    }
    this.currentPage.set(1);
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._Clients.getAll({
      pageNumber: this.currentPage(),
      pageSize:  this.pageSize,
      clientType:this.selectedProjectType()
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        if (response.success) {
          this.projects.set(response.value);
           this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        this.hasPreviousPage.set(response.hasPreviousPage);
        this.hasNextPage.set(response.hasNextPage);
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
              this._alert.toast('Employee deleted successfully.', 'success');
              this.projects.update((list) => list.filter(e => e.id !== card.id));
            },
            error: (err) => {
              this._alert.toast(err.error.detail, 'error');
            }
          });
        }
      });
  }

  onEdit(card: any, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.routes.navigate(['/editclient', card.id]);
  }


   nextPage() {
    if (this.hasNextPage()) {
      this.currentPage.update(v => v + 1);
      this.loadEmployees();
    }
  }
get pagesArray() {
  return Array.from({ length: this.totalPages() });
}
get visiblePages() {
  const total = this.totalPages();
  const current = this.currentPage();
  const windowSize = 4;

  let start = Math.max(1, current - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - windowSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
  prevPage() {
    if (this.hasPreviousPage()) {
      this.currentPage.update(v => v - 1);
      this.loadEmployees();
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadEmployees();
  }
}
