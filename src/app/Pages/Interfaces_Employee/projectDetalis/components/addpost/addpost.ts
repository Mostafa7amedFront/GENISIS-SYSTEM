import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../../../Core/service/post.service';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { SweetAlert } from '../../../../../Core/service/sweet-alert';

@Component({
  selector: 'app-addpost',
  imports: [ReactiveModeuls]  ,
  templateUrl: './addpost.html',
  styleUrls: ['./addpost.scss']
})
export class Addpost {
 form!: FormGroup;
  selectedFile!: File;
  coverFile!: File;
coverPreviewUrl: string | null = null;
  isLoading = signal(false);
@ViewChild('coverInput') coverInput!: ElementRef;

  previewUrl: string | null = null;
  isImage: boolean = false;
  isVideo: boolean = false;

  id!: string;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private postService: PostService,
    private _alert:SweetAlert
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      postingAt: ['', Validators.required],
      title: ['', Validators.required],
       Number: ['', Validators.required],
      captionEng: ['', Validators.required],
      captionAra: ['', Validators.required]
    });

    this.route.parent?.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) this.id = projectId;
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

triggerCoverInput() {
  this.coverInput.nativeElement.click();
}
  onCoverSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image')) {
    this._alert.toast('Cover must be an image', 'warning');
    return;
  }

  this.coverFile = file;
  this.coverPreviewUrl = URL.createObjectURL(file);
}
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;

  this.isImage = file.type.startsWith('image');
  this.isVideo = file.type.startsWith('video');

  this.previewUrl = URL.createObjectURL(file);

  if (!this.isVideo) {
    this.coverFile = undefined as any;
    this.coverPreviewUrl = null;
  }
}


  addPost() {
    if (this.form.invalid || !this.selectedFile) {
            this._alert.toast('Please fill all fields and upload media', 'warning');

      return;
    }
    this.isLoading.set(true);

    this.postService.addProjectPost(
      this.id,
      this.form.value.title,
      this.form.value.Number,
      this.form.value.captionEng,
      this.form.value.captionAra,
      this.form.value.postingAt,
      this.selectedFile,
      this.coverFile
    ).subscribe({
      next: (res) => {
      this._alert.toast('Post added successfully!', 'success');
       this.form.reset();
       this.postService.notifyRefresh();
       this.previewUrl = null;
       this.isImage = false;
       this.isVideo = false;
        this.coverPreviewUrl = null;
        this.selectedFile = null as any;
        this.coverFile = null as any;
        this.isLoading.set(false);
        
      },
      error: (err) => {
      this._alert.toast('Error adding Post', 'error');
        this.isLoading.set(false);
      }
    });
  }
}