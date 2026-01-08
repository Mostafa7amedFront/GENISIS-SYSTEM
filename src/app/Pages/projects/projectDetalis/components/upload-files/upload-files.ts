import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { ShortenPipe } from '../../../../../Shared/pipes/shorten-pipe';
import { environment } from '../../../../../../environments/environment';
import { ProjectService } from '../../../../../Core/service/project.service';
import { ActivatedRoute } from '@angular/router';
import { IProject, Note } from '../../../../../Core/Interface/iproject';
import { Feedback } from "../feedback/feedback";
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { Chat } from "../chat/chat";
import { SweetAlert } from '../../../../../Core/service/sweet-alert';
import { Posts } from "../posts/posts";
import { ShowMeeting } from "../show-meeting/show-meeting";
import { Addpost } from "../addpost/addpost";
import { MediaBuying } from "../media-buying/media-buying";
import { DownloadFileService } from '../../../../../Core/service/download-file.service';
import { Todolist } from "../todolist/todolist";
import { Submission } from "../submission/submission";
const statusTextMap = {
  0: 'In Progress',
  1: 'Paused',
  2: 'Completed'
};
@Component({
  selector: 'app-upload-files',
  imports: [ShortenPipe, Feedback, ReactiveModeuls, Chat, Posts, ShowMeeting, MediaBuying, Todolist, Submission],
  templateUrl: './upload-files.html',
  styleUrl: './upload-files.scss'
})
export class UploadFiles {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  files: File[] = [];
  baseimageUrl = `${environment.baseimageUrl}`;
  private _alert = inject(SweetAlert);
  constructor(private cdr: ChangeDetectorRef , private _downloadFile: DownloadFileService) {}
  isLoading = signal(false);
  private _project = inject(ProjectService);
  private _route = inject(ActivatedRoute);
  projectId!: any;
  aboutproject = signal<IProject | null>(null);


  ngOnInit(): void {
    const idParam = this._route.snapshot.paramMap.get('id');

    this.projectId = idParam;
    if (this.projectId) {
      this.loadEmployeeData();
    }
  }

  onUploadClick() {
    this.fileInput.nativeElement.click();
  }
changeStatus() {
  const project = this.aboutproject();
  if (!project) return;

  const newStatus = (project.projectStatus + 1) % 3;

  this._project.editProjectStatus(project.id, newStatus).subscribe({
    next: () => {
      this.aboutproject.update(p => ({
        ...p!,
        projectStatus: newStatus
      }));

      this._alert.toast('Project status updated successfully.', 'success');
    },
    error: () => {
      this._alert.toast('Failed to update project status.', 'error');
    }
  });
}

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const newFiles = Array.from(input.files);
    this.files = [...this.files, ...newFiles]; 
  }
  this.fileInput.nativeElement.value = '';
}

uploadFiles() {
  if (this.files.length === 0) {
    this._alert.toast('Please select files.', 'warning');
    return;
  }
  this.isLoading.set(true);
  this._project.uploadMultipleRequests(this.projectId, this.files).subscribe({
    next: (res) => {
      this._alert.toast('Files uploaded successfully.', 'success');
 
this.files = [];
this.files = [...this.files];
      this.fileInput.nativeElement.value = '';
         this.cdr.detectChanges();
      this.isLoading.set(false);
    },
    error: (err) => {
      this._alert.toast('Upload failed. Please try again.', 'error');
      this.isLoading.set(false);
    }
  });
}


downloadFile(fileUrl: any) {
  this._downloadFile.downloadFile(fileUrl).subscribe({
    next: (blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;

      // extract filename
      const fileName = fileUrl.split('/').pop() ?? 'downloaded_file';
      a.download = fileName;

      a.click();

      URL.revokeObjectURL(objectUrl);
    },
    error: (err) => {
    }
  });
}

  loadEmployeeData() {
    this._project.getById(this.projectId).subscribe({
      next: (res) => {
        this.aboutproject.set(res.value)

      },
      error: (err) => {
      }
    });
  }
  isImage(fileUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
  }

  isPdf(fileUrl: string): boolean {
    return /\.pdf$/i.test(fileUrl);
  }

  getFileUrl(fileUrl: string): string {
    return `${this.baseimageUrl}${fileUrl}`;
  }

  getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'unknown';
  }

}

