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
  id!: any; // <-- خليها هنا بدون تهيئة فورية


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

  baseimageUrl = `${environment.baseimageUrl}`;
  projects = signal<IProject[]>([]);


getProjectCounts() {
  const completed = this.projects().filter(p => p.projectStatus === 2).length;
  const inProgress = this.projects().filter(p => p.projectStatus === 0).length;
  const paused = this.projects().filter(p => p.projectStatus === 1).length;
  return { completed, inProgress, paused };
}
   ngOnInit(): void {
    const storedId = localStorage.getItem("Id_Clients");
    console.log("ID:", storedId);

    if (storedId) {
      this.id = storedId; 
      this.loadEmployees();
    } else {
      console.warn("⚠️ Id_Employees not found in localStorage");
    }
  }

loadEmployees(): void {
  this.isLoading.set(true);
  this.errorMessage.set('');

  const requestData = {
    pageNumber: 1,
    pageSize: 50,
    clientId: this.id 
  };

  this._project.getProjectClient(requestData).subscribe({
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
      this.errorMessage.set('An unexpected error occurred while loading data.');
      console.error('❌ Error fetching employees:', err);
    }
  });
}

}
