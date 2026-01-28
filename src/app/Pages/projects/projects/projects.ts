import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ShortenPipe } from '../../../Shared/pipes/shorten-pipe';
import { LeadingZeroPipe } from '../../../Shared/pipes/leading-zero-pipe';
import { SweetAlert } from '../../../Core/service/sweet-alert';
import { environment } from '../../../../environments/environment';
import { ProjectService } from '../../../Core/service/project.service';
import { Analytics, IProject, ProjectsValue } from '../../../Core/Interface/iproject';
import { IResponsePage } from '../../../Shared/Interface/iresonse';
type PeriodOption = {
  id: number;
  label: string;
  value: number | null;
};
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ShortenPipe, LeadingZeroPipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private _project = inject(ProjectService);
  private _alert = inject(SweetAlert);
  private routes = inject(Router);

  today = new Date();
  baseimageUrl = `${environment.baseimageUrl}`;

  // loading/error
  isLoading = signal(false);
  errorMessage = signal('');

  // data
  projects = signal<IProject[]>([]);
  analytics = signal<Analytics | null>(null);

  // pagination (UI 1-based, API 0-based)
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);
  hasPreviousPage = signal<boolean>(false);
  hasNextPage = signal<boolean>(false);
  pageSize = 12;

  // ===== Status (NO dropdown) =====
  // server expects: projectStatus: 0/1/2 or null (ALL)
  statusOptions = [
    { label: 'ALL PROJECTS', value: null as number | null },
    { label: 'IN PROGRESS', value: 0 },
    { label: 'PAUSED', value: 1 },
    { label: 'COMPLETED', value: 2 },
  ];
  selectedStatus = signal(this.statusOptions[0]);

  selectStatus(option: { label: string; value: number | null }) {
    this.selectedStatus.set(option);
    this.currentPage.set(1);
    this.loadProjects();
  }

  // ===== Creation period dropdown (months) =====
  isPeriodOpen = false;
  options = [
    { label: 'ALL TIME', value: null },
    { label: 'LAST MONTH', value: 1 },
    { label: 'LAST 3 MONTHS', value: 3 },
    { label: 'LAST 6 MONTHS', value: 6 },
    { label: 'LAST YEAR', value: 12 }
  ];
  selected = this.options[0];



  togglePeriodMenu() {
    this.isPeriodOpen = !this.isPeriodOpen;
  }

  selectPeriod(option: any) {
    this.selected = option;
    this.isPeriodOpen = false;
    this.currentPage.set(1);
    this.loadProjects();
  }

  // ===== Project type buttons =====
  selectedProjectType = signal<number | null>(null); // null => ALL
  selectType(type: number) {
    this.selectedProjectType.set(this.selectedProjectType() === type ? null : type);
    this.currentPage.set(1);
    this.loadProjects();
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  // counts (مش فلتر سيرفر زي ما انت طلبت)
  getProjectCounts() {
    const completed = this.projects().filter(p => p.projectStatus === 2).length;
    const inProgress = this.projects().filter(p => p.projectStatus === 0).length;
    const paused = this.projects().filter(p => p.projectStatus === 1).length;
    return { completed, inProgress, paused };
  }

  // text under NEW PROJECTS
  get periodText(): string {
    const option = this.options.find(o => o.value === this.selected.value);
    return option ? option.label : 'ALL TIME';
  }

  // ===== Load from server with filters =====
  loadProjects(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const body = {
      pageNumber: this.currentPage() , // ✅ API 0-based
      pageSize: this.pageSize,
      projectType: this.selectedProjectType(),        // null => all
      projectStatus: this.selectedStatus().value,     // null => all
      creationPeriod: this.selected.value ?? null,    // null => all().value     // 0/1/3/6/12
    };

    this._project.getAll(body).subscribe({
      next: (response: IResponsePage<ProjectsValue>) => {
        this.isLoading.set(false);

        if (!response.success) {
          this.projects.set([]);
          this.analytics.set(null);
          return;
        }

        this.projects.set(response.value?.items ?? []);
        this.analytics.set(response.value?.analytics ?? null);

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

  // delete
  onDelete(card: IProject, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this._alert.confirm(`Are you sure you want to delete ${card.projectTitle}?`, 'Confirm Delete')
      .then((result) => {
        if (result.isConfirmed) {
          this._project.delete(card.id).subscribe({
            next: () => {
              this._alert.toast('Project deleted successfully.', 'success');
              this.projects.update(list => list.filter(e => e.id !== card.id));
            },
            error: (err) => {
              this._alert.toast(err?.error?.detail ?? 'Delete failed', 'error');
            }
          });
        }
      });
  }

  onEdit(card: IProject, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.routes.navigate(['/editproject', card.id]);
  }

  // pagination
  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage.update(v => v + 1);
      this.loadProjects();
    }
  }

  prevPage() {
    if (this.hasPreviousPage()) {
      this.currentPage.update(v => v - 1);
      this.loadProjects();
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProjects();
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
