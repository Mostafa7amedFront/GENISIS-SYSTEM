import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Clients } from '../../Core/service/clients';
import { SweetAlert } from '../../Core/service/sweet-alert';
import { environment } from '../../../environments/environment';
import { Item, Analytics, ClientRes } from '../../Core/Interface/iclients';
import { LeadingZeroPipe } from '../../Shared/pipes/leading-zero-pipe';
import { IResponsePage } from '../../Shared/Interface/iresonse';

@Component({
  selector: 'app-client',
  standalone: true,
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

  private _Clients = inject(Clients);
  private _alert = inject(SweetAlert);
  private routes = inject(Router);

  today = new Date();
  isLoading = signal(false);
  errorMessage = signal('');

  baseimageUrl = `${environment.baseimageUrl}`;

  // ✅ دي اللي المفروض نعرضها في الكروت
  projects = signal<Item[]>([]);

  // ✅ analytics للبوكس اللي فوق
  analytics = signal<Analytics | null>(null);

  selectedProjectType = signal<number | null>(null);

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.selected = option;
    this.isOpen = false;
    this.currentPage.set(1);
    this.loadClients();
  }

  ngOnInit(): void {
    this.loadClients();
  }

  selectProjectType(type: number) {
    this.selectedProjectType.set(this.selectedProjectType() === type ? null : type);
    this.currentPage.set(1);
    this.loadClients();
  }

  getProjectCounts() {
    const oldClient = this.projects().filter(p => p.clientType === 0).length;
    const longTerm = this.projects().filter(p => p.clientType === 1).length;
    const newClient = this.projects().filter(p => p.clientType === 2).length;
    return { oldClient, longTerm, newClient };
  }

  // ✅ Robust parsing لأي شكل Response
  private extractItemsAndAnalytics(value: any): { items: Item[]; analytics: Analytics | null } {
    // case A: value = {items, analytics}
    if (value && Array.isArray(value.items)) {
      return { items: value.items as Item[], analytics: (value.analytics ?? null) as Analytics | null };
    }

    // case B: value = Item[]
    if (Array.isArray(value)) {
      return { items: value as Item[], analytics: null };
    }

    // fallback
    return { items: [], analytics: null };
  }
  get periodText(): string {
  if (this.selected?.value === null) return 'ALL TIME';

  switch (this.selected.value) {
    case 1:
      return 'IN THE PAST 30 DAYS';
    case 3:
      return 'IN THE PAST 3 MONTHS';
    case 6:
      return 'IN THE PAST 6 MONTHS';
    case 12:
      return 'IN THE PAST YEAR';
    default:
      return 'ALL TIME';
  }
}


  loadClients(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._Clients.getAll({
      pageNumber: this.currentPage(),
      pageSize: this.pageSize,
      clientType: this.selectedProjectType(),
      // لو الباك محتاج مدة زمنية:
      creationPeriod: this.selected.value
    }).subscribe({
      next: (response: IResponsePage<any>) => {
        this.isLoading.set(false);

        if (!response.success) {
          this.projects.set([]);
          this.analytics.set(null);
          return;
        }

        const { items, analytics } = this.extractItemsAndAnalytics(response.value);

        this.projects.set(items);
        this.analytics.set(analytics);

        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        this.hasPreviousPage.set(response.hasPreviousPage);
        this.hasNextPage.set(response.hasNextPage);
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

  onDelete(card: Item, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this._alert.confirm(`Are you sure you want to delete ${card.name}?`, 'Confirm Delete')
      .then((result) => {
        if (result.isConfirmed) {
          this._Clients.delete(card.id).subscribe({
            next: () => {
              this._alert.toast('Client deleted successfully.', 'success');
              this.projects.update((list) => list.filter(e => e.id !== card.id));
            },
            error: (err) => {
              this._alert.toast(err?.error?.detail ?? 'Delete failed', 'error');
            }
          });
        }
      });
  }

  onEdit(card: Item, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.routes.navigate(['/editclient', card.id]);
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage.update(v => v + 1);
      this.loadClients();
    }
  }

  prevPage() {
    if (this.hasPreviousPage()) {
      this.currentPage.update(v => v - 1);
      this.loadClients();
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadClients();
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
}
