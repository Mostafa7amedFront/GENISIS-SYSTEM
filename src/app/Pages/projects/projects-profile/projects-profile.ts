import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../../Core/service/project.service';
import { IProject } from '../../../Core/Interface/iproject';
import { environment } from '../../../../environments/environment';
import { ShortenPipe } from '../../../Shared/pipes/shorten-pipe';
import { LeadingZeroPipe } from '../../../Shared/pipes/leading-zero-pipe';

@Component({
  selector: 'app-projects-profile',
  imports: [CommonModule, RouterLink, DatePipe , ShortenPipe , LeadingZeroPipe],
  templateUrl: './projects-profile.html',
  styleUrl: './projects-profile.scss'
})
export class ProjectsProfile {
  isOpen = false;
  selected = signal('ALL PROJECTS'); 
  options = ['ALL PROJECTS', 'IN PROGRESS', 'PAUSED', 'COMPLETED'];

  private _route = inject(ActivatedRoute);
  private _project = inject(ProjectService);

  projects = signal<IProject[]>([]);
  baseurl = environment.baseimageUrl;
  employeeId!: any;

  @Input() tpyeOfProject: boolean = true
  ngOnInit(): void {
   const idParam = this._route.snapshot.paramMap.get('id');
  this.employeeId = idParam;
  if (this.employeeId) {
    this.loadProject(this.employeeId);
  }

  }

  
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
getProjectCounts() {
  const completed = this.projects().filter(p => p.projectStatus === 2).length;
  const inProgress = this.projects().filter(p => p.projectStatus === 0).length;
  const paused = this.projects().filter(p => p.projectStatus === 1).length;
  return { completed, inProgress, paused };
}
loadProject(Id: string) {
  if (this.tpyeOfProject) {
    this._project.getProjectEmployee({
      pageNumber: 1,
      pageSize: 50,
      employeeId: Id 
    }).subscribe({
      next: res => {
        this.projects.set(res.value);
      }
    });
  } else {
    this._project.getProjectClient({
      pageNumber: 1,
      pageSize: 50,
      clientId: Id 
    }).subscribe({
      next: res => {
        this.projects.set(res.value);
      }
    });
  }
}

}
