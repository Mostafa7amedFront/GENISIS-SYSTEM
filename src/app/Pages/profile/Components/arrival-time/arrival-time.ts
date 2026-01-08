import { Component, computed, signal } from '@angular/core';
interface DaySchedule {
  date: string;
  day: string;
  time: string;
  status?: 'normal' | 'absent' | 'highlight';
}

@Component({
  selector: 'app-arrival-time',
  imports: [],
  templateUrl: './arrival-time.html',
  styleUrl: './arrival-time.scss'
})
export class ArrivalTime {
  months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL',
    'MAY', 'JUNE', 'JULY', 'AUGUST',
    'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  currentMonthIndex = signal(7); // AUGUST
  currentWeek = signal(1);

  schedules = signal<DaySchedule[]>([
    { date: '23', day: 'SUNDAY', time: '12:30 PM - 1:00 PM' },
    { date: '24', day: 'MONDAY', time: '12:30 PM - 1:00 PM' },
    { date: '25', day: 'TUESDAY', time: '11:15 PM - 6:00 PM', status: 'highlight' },
    { date: '25', day: 'WEDNESDAY', time: '0:00 PM - 0:00 PM' },
    { date: '25', day: 'THURSDAY', time: '0:00 PM - 0:00 PM' },
    { date: '25', day: 'FRIDAY', time: 'ABSENT', status: 'absent' },
    { date: '25', day: 'SATURDAY', time: '0:00 PM - 0:00 PM' },
  ]);

  currentMonth = computed(() => this.months[this.currentMonthIndex()]);

  nextMonth() {
    if (this.currentMonthIndex() < 11)
      this.currentMonthIndex.update(v => v + 1);
  }

  prevMonth() {
    if (this.currentMonthIndex() > 0)
      this.currentMonthIndex.update(v => v - 1);
  }

  nextWeek() {
    this.currentWeek.update(v => v + 1);
  }

  prevWeek() {
    if (this.currentWeek() > 1)
      this.currentWeek.update(v => v - 1);
  }
}
