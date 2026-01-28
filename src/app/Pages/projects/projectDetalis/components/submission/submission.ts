import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubmissionService } from '../../../../../Core/service/submission.service';
import { Submission, UpdateSubmissionPayload } from '../../../../../Core/Interface/iproject';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { DownloadFileService } from '../../../../../Core/service/download-file.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert } from '../../../../../Core/service/sweet-alert';

export enum FileStatus {
  TryAgain = 0,
  Done = 1,
  Mistake = 2
}

@Component({
  selector: 'app-submission',
  standalone: true,
  imports: [ReactiveModeuls, FormsModule],
  templateUrl: './submission.html',
  styleUrl: './submission.scss'
})
export class SubmissionComponent {
  private api = inject(SubmissionService );
private _downloadFile = inject(DownloadFileService);
private _alert = inject(SweetAlert);
  projectId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  submissions = signal<Submission[]>([]);
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
    this.api.getSubmissions(this.projectId).subscribe({
      next: (list) => {
        this.submissions.set(list);

        // initialize local state
        const c: Record<string, string> = {};
        const q: Record<string, number> = {};
        const s: Record<string, Record<string, number>> = {};

        for (const sub of list) {
          c[sub.id] = sub.comment ?? '';
          q[sub.id] = sub.quality ?? 0;
          s[sub.id] = {};
          for (const att of sub.attachments) {
            s[sub.id][att.id] = att.status ?? 0;
          }
        }

        this.comments.set(c);
        this.qualities.set(q);
        this.attachmentStatuses.set(s);
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false)
    });
  }
commentValue(submissionId: string): string {
  return this.comments()[submissionId] ?? '';
}

onCommentChange(submissionId: string, value: string) {
  this.comments.update(c => ({ ...c, [submissionId]: value }));
}
  // toggle attachment status on click
  toggleAttachmentStatus(submissionId: string, attachmentId: string) {
    this.attachmentStatuses.update(all => {
      const perSub = { ...(all[submissionId] ?? {}) };
      const current = perSub[attachmentId] ?? 0;
      perSub[attachmentId] = this.nextStatus(current);
      return { ...all, [submissionId]: perSub };
    });
  }

  nextStatus(current: number): number {
    // 0 -> 1 -> 2 -> 0
    return current === FileStatus.TryAgain
      ? FileStatus.Done
      : current === FileStatus.Done
      ? FileStatus.Mistake
      : FileStatus.TryAgain;
  }

  statusClass(status: number) {
    // classes for ngClass
    return status === FileStatus.TryAgain
      ? 'tryagain'
      : status === FileStatus.Done
      ? 'done'
      : 'isMistack';
  }



  submitReview(submissionId: string) {
    const comment = this.comments()[submissionId] ?? '';
    const quality = this.qualities()[submissionId] ?? 0;
    const statuses = this.attachmentStatuses()[submissionId] ?? {};

    const payload: UpdateSubmissionPayload = {
      comment,
      quality,
      attachments: Object.entries(statuses).map(([id, status]) => ({
        id,
        status
      }))
    };

    this.api.updateSubmission(submissionId, payload).subscribe({
      next: () => {

        this._alert.toast('Review submitted successfully.', 'success');
      },
      error: (err) => {
        console.error(err);
        this._alert.toast('Error submitting review', 'error');
      }
    });
  }
}
