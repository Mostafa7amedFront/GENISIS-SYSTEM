import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../../Core/service/project.service';
import { environment } from '../../../../environments/environment';
import { IProject } from '../../../Core/Interface/iproject';
import { MeetingService } from '../../../Core/service/Clients/meeting.service';
import { SweetAlert } from '../../../Core/service/sweet-alert';

@Component({
  selector: 'app-set-meeting',
  imports: [CommonModule],
  templateUrl: './set-meeting.html',
  styleUrl: './set-meeting.scss'
})
export class SetMeeting {
private _project = inject(ProjectService);
  private _meeting = inject(MeetingService);
  private _alert = inject(SweetAlert);

  baseimageUrl = environment.baseimageUrl;

  // Signals
  projects = signal<IProject[]>([]);
  selectedProjectId = signal<string | null>(null);
  selectedSlot = signal<string | null>(null);
  selectedDate = signal(new Date());

  id!: string | null;

  // Time slots
  slots = [
    '12:00 PM - 12:30 PM',
    '12:30 PM - 1:00 PM',
    '1:30 PM - 2:00 PM',
    '2:00 PM - 2:30 PM',
    '2:30 PM - 3:00 PM',
    '3:00 PM - 3:30 PM',
    '3:30 PM - 4:00 PM',
    '4:00 PM - 4:30 PM'
  ];

  // Calendar
  currentDate = new Date();

  ngOnInit(): void {
    this.id = localStorage.getItem('Id_Clients');
    if (this.id) {
      this.loadProjects(this.id);
    } else {
    }
  }

  selectProject(id: string) {
    this.selectedProjectId.set(id);
  }

  private loadProjects(clientId: string): void {
    const requestData = {
      pageNumber: 1,
      pageSize: 50000,
      clientId
    };

    this._project.getProjectClient(requestData).subscribe({
      next: res => this.projects.set(res.success ? res.value : []),
      error: err => console.error('❌ Error fetching projects:', err)
    });
  }

  selectSlot(slot: string) {
    this.selectedSlot.set(slot);
  }

  getSlotIndex(slot: string | Date): number {
    if (typeof slot === 'string') {
      return this.slots.indexOf(slot);
    }
    const hour = slot.getHours();
    const minutes = slot.getMinutes();

    if (hour === 12 && minutes < 30) return 0;
    if (hour === 12 && minutes >= 30) return 1;
    if (hour === 13 && minutes >= 30) return 2;
    if (hour === 14 && minutes < 30) return 3;
    if (hour === 14 && minutes >= 30) return 4;
    if (hour === 15 && minutes < 30) return 5;
    if (hour === 15 && minutes >= 30) return 6;
    if (hour === 16 && minutes < 30) return 7;

    return -1;
  }

  get monthYear(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  }

  daysInMonth(): number[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }

  selectDate(day: number) {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    this.selectedDate.set(date);
  }

  isSelected(day: number): boolean {
    const sel = this.selectedDate();
    return sel.getDate() === day &&
           sel.getMonth() === this.currentDate.getMonth() &&
           sel.getFullYear() === this.currentDate.getFullYear();
  }

  bookMeeting() {
    const projectId = this.selectedProjectId();
    const slot = this.selectedSlot();

    if (!projectId || !slot) {
      this._alert.toast('Please select a project and a slot.', 'warning');
      return;
    }

    const slotIndex = this.getSlotIndex(slot);
    const dateISO = this.selectedDate().toISOString();

    this._meeting.addMeeting(projectId, dateISO, slotIndex).subscribe({
      next: () => {
        this._alert.toast('Meeting booked!', 'success');
        this.clearSelection();
      },
      error: () => this._alert.toast('Error booking meeting!', 'error')
    });
  }

  private clearSelection() {
    this.selectedProjectId.set(null);
    this.selectedSlot.set(null);
    this.selectedDate.set(new Date());
  }
}
