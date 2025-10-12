import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../../../../Core/Interface/iproject';
import { ProjectService } from '../../../../../Core/service/project.service';
import { ActivatedRoute } from '@angular/router';
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
newTodoText = '';
  todoList: Note[] = [];
  completedList: Note[] = [];
  projectId!: any;

  constructor(private projectService: ProjectService , private _route:ActivatedRoute) {}

  ngOnInit(): void {
          const idParam = this._route.snapshot.paramMap.get('id');

    this.projectId = idParam;
    this.loadNotes();
  }

  // جلب البيانات من الـ API
  loadNotes(): void {
    this.projectService.getById(this.projectId).subscribe({
      next: (res) => {
        if (res?.success ) {
          const project = res.value;
          const notes: Note[] = project.notes || [];

          this.todoList = notes.filter(n => !n.isCompleted);
          this.completedList = notes.filter(n => n.isCompleted);
        }
      },
      error: (err) => console.error('❌ Failed to fetch project data:', err)
    });
  }

  // إضافة نوت جديدة (محلياً فقط مؤقتاً)
  addTodo(): void {
    const text = this.newTodoText.trim();
    if (!text) return;

    const newNote: Note = {
      id: +crypto.randomUUID(),
      isCompleted: false,
      isFav: false,
      noteContent: text
    };

    this.todoList.push(newNote);
    this.newTodoText = '';

    // إرسال للـ API لاحقًا (اختياري)
    // this.projectService.addNote(this.projectId, newNote).subscribe();
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTodo();
    }
  }

  toggleComplete(note: Note, fromCompleted = false): void {
    note.isCompleted = !note.isCompleted;
    if (fromCompleted) {
      this.completedList = this.completedList.filter(n => n.id !== note.id);
      this.todoList.push(note);
    } else {
      this.todoList = this.todoList.filter(n => n.id !== note.id);
      this.completedList.push(note);
    }
  }

  toggleStar(note: Note): void {
    note.isFav = !note.isFav;
  }

}
