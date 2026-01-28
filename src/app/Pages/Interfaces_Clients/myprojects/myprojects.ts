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
import { IMyProject } from '../../../Core/Interface/iproject-employee';
import { FeedbackClientsService } from '../../../Core/service/Clients/feedback-clients.service';

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


  private _project = inject(FeedbackClientsService);
  today = new Date();
  isLoading = signal(false);
  errorMessage = signal('');

  baseimageUrl = `${environment.baseimageUrl}`;
  projects = signal<IMyProject[]>([]);


  getProjectCounts() {
    const completed = this.projects().filter(p => p.projectStatus === 2).length;
    const inProgress = this.projects().filter(p => p.projectStatus === 0).length;
    const paused = this.projects().filter(p => p.projectStatus === 1).length;
    return { completed, inProgress, paused };
  }
  ngOnInit(): void {

    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._project.getMyProjects().subscribe({
      next: (response) => {
        this.isLoading.set(false);

               this.projects.set(response.projects);

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
    switch (this.selected()) {
      case 'IN PROGRESS': return filtered.filter(p => p.projectStatus === 0);
      case 'PAUSED': return filtered.filter(p => p.projectStatus === 1);
      case 'COMPLETED': return filtered.filter(p => p.projectStatus === 2);
      default: return filtered;
    }
  });

  selectProjectType(type: number) {
    if (this.selectedProjectType() === type) {
      this.selectedProjectType.set(null);
    } else {
      this.selectedProjectType.set(type);
    }
  }


}
