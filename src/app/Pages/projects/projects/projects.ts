import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ShortenPipe } from '../../../Shared/pipes/shorten-pipe';
import { LeadingZeroPipe } from '../../../Shared/pipes/leading-zero-pipe';
import { IClients } from '../../../Core/Interface/iclients';
import { Clients } from '../../../Core/service/clients';
import { SweetAlert } from '../../../Core/service/sweet-alert';
import { environment } from '../../../../environments/environment';
import { ProjectService } from '../../../Core/service/project.service';
import { IProject } from '../../../Core/Interface/iproject';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, RouterModule, ShortenPipe , LeadingZeroPipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  isOpen = false;
  selected = signal('ALL PROJECTS'); 
  options = ['ALL PROJECTS', 'IN PROGRESS', 'PAUSED', 'COMPLETED'];


  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selected.set(option);
    this.isOpen = false;
  }
  filteredProjects = computed(() => {
    const all = this.projects();
    const selected = this.selected();

    switch (selected) {
      case 'IN PROGRESS':
        return all.filter(p => p.projectStatus === 0);
      case 'PAUSED':
        return all.filter(p => p.projectStatus === 1);
      case 'COMPLETED':
        return all.filter(p => p.projectStatus === 2);
      default:
        return all;
    }
  });

  private _project = inject(ProjectService);  
  today = new Date();
  isLoading = signal(false);
  errorMessage = signal('');
  private _alert = inject(SweetAlert);
  private routes = inject(Router);
  baseimageUrl = `${environment.baseimageUrl}`;
  projects = signal<IProject[]>([]);


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

    this._project.getAll({
      pageNumber: 1,
      pageSize: 50,
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

  onDelete(card: IProject, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this._alert.confirm(`Are you sure you want to delete ${card.clientName}?`, 'Confirm Delete')
      .then((result) => {
        if (result.isConfirmed) {
          this._project.delete(card.id).subscribe({
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
    this.routes.navigate(['/editproject', card.id]);
  }

}
