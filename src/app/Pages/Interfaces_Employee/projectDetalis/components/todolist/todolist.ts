import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../../../../Core/Interface/iproject';
import { ProjectService } from '../../../../../Core/service/project.service';
import { ActivatedRoute } from '@angular/router';
import { NotesService } from '../../../../../Core/service/notes.service';
interface TodoItem {
  id: number;
  text: string;
  starred?: boolean;
  createdAt: Date;
}
@Component({
  selector: 'app-todolist',
  imports: [CommonModule, FormsModule],
  templateUrl: './todolist.html',
  styleUrl: './todolist.scss'
})
export class Todolist {
 projectId!: any;
  newTodoText = '';

  private _notesService = inject(NotesService);
  private _route = inject(ActivatedRoute);

  notes = signal<Note[]>([]);

  completedList = computed(() =>
    this.notes().filter((n) => n.isCompleted)
  );

  activeNotes = computed(() =>
    this.notes().filter((n) => !n.isCompleted)
  );

  ngOnInit(): void {
    const idParam = this._route.snapshot.paramMap.get('id');
    this.projectId = idParam;

    if (this.projectId) {
      this.loadNotes();
    }

    console.log('📌 Project ID:', this.projectId);
  }

  loadNotes(): void {
    this._notesService.getProjectNotes(this.projectId).subscribe({
      next: (res) => {
        this.notes.set(res.value || []);
        console.log('✅ Notes loaded:', res);
      },
      error: (err) => {
        console.error('❌ Error loading notes:', err);
      }
    });
  }

  updateNote(note: Note): void {
    const updatedData = {
      note: note.noteContent,
      isFav: note.isFav,
      isCompleted: note.isCompleted,
    };

    this._notesService.editNote(note.id, updatedData).subscribe({
      next: (res) => {
        console.log('✅ Note updated successfully:', res);
      },
      error: (err) => {
        console.error('❌ Error updating note:', err);
      },
    });
  }

  toggleComplete(note: Note): void {
    const updatedNote = { ...note, isCompleted: !note.isCompleted };

    this.notes.update(notes =>
      notes.map(n => n.id === note.id ? updatedNote : n)
    );

    this.updateNote(updatedNote);
  }

  toggleStar(note: Note): void {
    const updatedNote = { ...note, isFav: !note.isFav };

    this.notes.update(notes =>
      notes.map(n => n.id === note.id ? updatedNote : n)
    );

    this.updateNote(updatedNote);
  }

  addTodo(): void {
   const content = this.newTodoText.trim();
  if (!content) return;

  // البيانات اللي هتتبعت للسيرفر
  const requestBody = {
    note: content,
    isFav: false,
    isCompleted: false
  };

  this._notesService.addNote(this.projectId.toString(), requestBody).subscribe({
    next: (res) => {
      console.log('✅ Note added successfully:', res);

      // ضيف الملاحظة الجديدة محلياً بنفس البنية اللي الـ API بيرجعها
      const addedNote: Note = {
        id: res.value,          // السيرفر رجّع UUID
        noteContent: content,   // النص اللي المستخدم كتبه
        isFav: false,
        isCompleted: false
      };

      // أضفها في الأعلى
      this.notes.update(notes => [addedNote, ...notes]);

      // فضي حقل الإدخال
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
}
