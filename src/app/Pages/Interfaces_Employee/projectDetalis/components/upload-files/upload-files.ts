import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { ShortenPipe } from '../../../../../Shared/pipes/shorten-pipe';
import { environment } from '../../../../../../environments/environment';
import { ProjectService } from '../../../../../Core/service/project.service';
import { ActivatedRoute } from '@angular/router';
import { IProject, Note } from '../../../../../Core/Interface/iproject';
import { Todolist } from "../todolist/todolist";
import { Feedback } from "../feedback/feedback";
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { Chat } from "../chat/chat";
import { SweetAlert } from '../../../../../Core/service/sweet-alert';

@Component({
  selector: 'app-upload-files',
  imports: [ShortenPipe, Feedback, ReactiveModeuls, Chat, Todolist],
  templateUrl: './upload-files.html',
  styleUrl: './upload-files.scss'
})
export class UploadFiles {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  files: File[] = [];
  baseimageUrl = `${environment.baseimageUrl}`;
  private _alert = inject(SweetAlert);
  constructor(private cdr: ChangeDetectorRef) {}

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
    console.log(this.projectId)
  }


  onUploadClick() {
    this.fileInput.nativeElement.click();
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

  this._project.uploadMultipleRequests(this.projectId, this.files).subscribe({
    next: (res) => {
      console.log('✅ Uploaded successfully:', res);
      this._alert.toast('Files uploaded successfully.', 'success');

this.files = [];
this.files = [...this.files];
      this.fileInput.nativeElement.value = '';
         this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('❌ Upload failed:', err);
      this._alert.toast('Upload failed. Please try again.', 'error');
    }
  });
}



  loadEmployeeData() {
    this._project.getById(this.projectId).subscribe({
      next: (res) => {
        console.log(res.value)
        this.aboutproject.set(res.value)

      },
      error: (err) => {
        console.error(err);
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

