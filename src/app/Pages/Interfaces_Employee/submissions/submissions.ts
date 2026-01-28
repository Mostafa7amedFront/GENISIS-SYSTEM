import { Component, inject, signal } from '@angular/core';
import { MySubmission, SubmissionService } from '../../../Core/service/submission.service';
import { DownloadFileService } from '../../../Core/service/download-file.service';
import { ActivatedRoute } from '@angular/router';
import { Submission, UpdateSubmissionPayload } from '../../../Core/Interface/iproject';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
export enum FileStatus {
  TryAgain = 0,
  Done = 1,
  Mistake = 2
}

@Component({
  selector: 'app-submissions',
  imports: [ReactiveModeuls],
  templateUrl: './submissions.html',
  styleUrl: './submissions.scss'
})
export class Submissions {
  private api = inject(SubmissionService );
private _downloadFile = inject(DownloadFileService);
  submissions = signal<MySubmission[]>([]);
  loading = signal(false);

  comments = signal<Record<string, string>>({});
  qualities = signal<Record<string, number>>({});


  attachmentStatuses = signal<Record<string, Record<string, number>>>({});

  ngOnInit() {
    this.loadSubmissions();
  }
downloadFile(fileUrl: string) {
  this._downloadFile.downloadFile(fileUrl).subscribe({
    next: (blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);

      a.href = objectUrl;
      a.download = fileUrl.split('/').pop() || 'file';
      a.click();

      URL.revokeObjectURL(objectUrl);
    },
    error: () => {
      console.error('Download failed');
    }
  });
}
setQuality(submissionId: string, value: number) {
  this.qualities.update(q => ({ ...q, [submissionId]: value }));
}

getQuality(submissionId: string): number {
  return this.qualities()[submissionId] ?? 0;
}

  loadSubmissions() {
    this.loading.set(true);

    this.api.getMySubmissions().subscribe({
      next: (res) => {
        this.submissions.set(res);
      },
      error: () => {
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }


  statusClass(status: number) {
    // classes for ngClass
    return status === FileStatus.TryAgain
      ? 'tryagain'
      : status === FileStatus.Done
      ? 'done'
      : 'isMistack';
  }




}
