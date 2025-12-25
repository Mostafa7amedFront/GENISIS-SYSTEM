import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ShortenPipe } from '../../../Shared/pipes/shorten-pipe';
import { LeadingZeroPipe } from '../../../Shared/pipes/leading-zero-pipe';
import { SweetAlert } from '../../../Core/service/sweet-alert';
import { environment } from '../../../../environments/environment';
import { ProjectService } from '../../../Core/service/project.service';
import { IProject } from '../../../Core/Interface/iproject';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';

@Component({
  selector: 'app-myprojects',
  imports: [LeadingZeroPipe , ReactiveModeuls , ShortenPipe ,DatePipe],
  templateUrl: './myprojects.html',
  styleUrl: './myprojects.scss'
})
export class Myprojects {
 isOpen = false;
  selected = signal('ALL PROJECTS');
  options = ['ALL PROJECTS', 'IN PROGRESS', 'PAUSED', 'COMPLETED'];
  selectedProjectType = signal<number | null>(null);


  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selected.set(option);
    this.isOpen = false;
  }


  private _project = inject(ProjectService);
  today = new Date();
  isLoading = signal(false);
  errorMessage = signal('');
  private _alert = inject(SweetAlert);
  private routes = inject(Router);
  baseimageUrl = `${environment.baseimageUrl}`;
  projects = signal<IProject[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);
  hasPreviousPage = signal<boolean>(false);
  hasNextPage = signal<boolean>(false);
  pageSize = 12;
  id!: any; // <-- خليها هنا بدون تهيئة فورية

  getProjectCounts() {
    const completed = this.projects().filter(p => p.projectStatus === 2).length;
    const inProgress = this.projects().filter(p => p.projectStatus === 0).length;
    const paused = this.projects().filter(p => p.projectStatus === 1).length;
    return { completed, inProgress, paused };
  }
  ngOnInit(): void {
        const storedId = localStorage.getItem("Id_Clients");
    this.id = storedId ;
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._project.getProjectClient({
      pageNumber: this.currentPage(),
      pageSize:   this.pageSize,
      clientId: this.id
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        if (response.success && response.value.length > 0) {
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


  filteredProjects = computed(() => {
    let filtered = this.projects();

    const selectedStatus = this.selected();
    switch (selectedStatus) {
      case 'IN PROGRESS':
        filtered = filtered.filter(p => p.projectStatus === 0);
        break;
      case 'PAUSED':
        filtered = filtered.filter(p => p.projectStatus === 1);
        break;
      case 'COMPLETED':
        filtered = filtered.filter(p => p.projectStatus === 2);
        break;
    }

    if (this.selectedProjectType() !== null) {
      filtered = filtered.filter(p => p.projectType === this.selectedProjectType());
    }

    return filtered;
  });


  selectProjectType(type: number) {
    if (this.selectedProjectType() === type) {
      this.selectedProjectType.set(null);
    } else {
      this.selectedProjectType.set(type);
    }
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
