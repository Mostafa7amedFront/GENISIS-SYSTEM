import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, inject, signal, computed } from '@angular/core';
import { ShortenPipe } from '../../../../../Shared/pipes/shorten-pipe';
import { environment } from '../../../../../../environments/environment';
import { ProjectService } from '../../../../../Core/service/project.service';
import { ActivatedRoute } from '@angular/router';
import { IProject, Note } from '../../../../../Core/Interface/iproject';
import { Todolist } from "../todolist/todolist";
import { Feedback } from "../feedback/feedback";
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { Chat } from "../chat/chat";

@Component({
  selector: 'app-upload-files',
  imports: [ShortenPipe, Feedback, ReactiveModeuls, Chat],
  templateUrl: './upload-files.html',
  styleUrl: './upload-files.scss'
})
export class UploadFiles {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  files: File[] = [];
  baseimageUrl = `${environment.baseimageUrl}`;

  private _project = inject(ProjectService);
  private _route = inject(ActivatedRoute);
  projectId!: any;
  aboutproject = signal<IProject | null>(null);
  notes = signal<Note[]>([]);

  completedList = computed(() =>
    this.notes().filter((n) => n.isCompleted)
  );

  activeNotes = computed(() =>
    this.notes().filter((n) => !n.isCompleted)
  );

  updateNote(note: Note): void {
    const updatedData = {
      note: note.noteContent,
      isFav: note.isFav,
      isCompleted: note.isCompleted,
    };

    this._project.editNote(note.id, updatedData).subscribe({
      next: (res) => {
        console.log('✅ Note updated successfully:', res);
      },
      error: (err) => {
        console.error('❌ Error updating note:', err);
      },
    });
  }
  toggleComplete(note: Note): void {
    const updatedNote: Note = {
      ...note,
      isCompleted: !note.isCompleted
    };

    this.notes.update(notes =>
      notes.map(n => n.id === note.id ? updatedNote : n)
    );

    this.updateNote(updatedNote);
  }
  toggleStar(note: Note): void {
    const updatedNote: Note = {
      ...note,
      isFav: !note.isFav
    };

    this.notes.update(notes =>
      notes.map(n => n.id === note.id ? updatedNote : n)
    );

    this.updateNote(updatedNote);
  }
newTodoText = ''; // لحفظ النص المكتوب

addTodo(): void {
  const content = this.newTodoText.trim();
  if (!content) return; 

  const newNote: Note = {
    id: 0, // مؤقت، السيرفر هيولد ID جديد
    noteContent: content,
    isFav: false,
    isCompleted: false
  };

  this._project.addNote(this.projectId, newNote).subscribe({
    next: (res) => {
      console.log('✅ Note added successfully:', res);

      this.notes.update(notes => [...notes, res.value || newNote]);
      this.loadEmployeeData();
      this.newTodoText = '';
    },
    error: (err) => {
      console.error('❌ Error adding note:', err);
    }
  });
}
handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    this.addTodo();
  }
}

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
      this.files = Array.from(input.files);
    }
  }

  uploadFiles() {
    if (this.files.length === 0) {
      alert('Please select files.');
      return;
    }

    this._project.uploadMultipleRequests(this.projectId, this.files).subscribe({
      next: (res) => console.log('✅ Uploaded successfully:', res),
      error: (err) => console.error('❌ Upload failed:', err)
    });
  }




  loadEmployeeData() {
    this._project.getById(this.projectId).subscribe({
      next: (res) => {
        console.log(res.value)
        this.aboutproject.set(res.value)
        this.notes.set(res.value.notes || []);

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

