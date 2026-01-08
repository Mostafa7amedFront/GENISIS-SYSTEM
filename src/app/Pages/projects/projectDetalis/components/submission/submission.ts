import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
export enum FileStatus {
  TryAgain = 'TRY_AGAIN',
  Done = 'DONE',
  Mistake = 'MISTAKE'
}
@Component({
  selector: 'app-submission',
  imports: [CommonModule],
  templateUrl: './submission.html',
  styleUrl: './submission.scss'
})
export class Submission {
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
