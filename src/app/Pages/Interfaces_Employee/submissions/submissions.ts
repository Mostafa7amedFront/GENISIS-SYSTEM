import { Component, inject, signal } from '@angular/core';
import { MySubmission, SubmissionService } from '../../../Core/service/submission.service';
import { DownloadFileService } from '../../../Core/service/download-file.service';
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
      FileStatus = FileStatus;

  files = signal<{ id: number; status: FileStatus }[]>([
    { id: 1, status: FileStatus.TryAgain },
    { id: 2, status: FileStatus.Done },
    { id: 3, status: FileStatus.Mistake }
  ]);

changeStatus(index: number) {
  this.testFiles.update(files => {
    const current = files[index].status;

    files[index].status =
      current === 'tryagain'
        ? 'done'
        : current === 'done'
        ? 'isMistack'
        : 'tryagain';

    return [...files];
  });
}


sendStatusToBackend(fileId: number, status: FileStatus) {

}
testFiles = signal([
  { status: 'tryagain' },
  { status: 'done' },
  { status: 'isMistack' },
  { status: 'tryagain' }
]);

nextStatus(current: string) {
  return current === 'tryagain'
    ? 'done'
    : current === 'done'
    ? 'isMistack'
    : 'tryagain';
}
}
