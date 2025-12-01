import { Component, signal } from '@angular/core';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';

interface CalendarDay {
  date: Date;
  current: boolean; // هل اليوم ينتمي للشهر الحالي؟
}

@Component({
  selector: 'app-media-buying',
  imports: [ReactiveModeuls],
  templateUrl: './media-buying.html',
  styleUrls: ['./media-buying.scss'],
})
export class MediaBuying {
  campaignType = signal<'Engagement' | 'Awareness' | 'Sales'>('Sales');
  selectCampaign(value: 'Engagement' | 'Awareness' | 'Sales') {
    this.campaignType.set(value);
    console.log(value)
  }

  quickFilters = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days', 'Last 12 months', 'Last Year'];
  activeFilter = signal('Last 7 days');
  selectFilter(filter: string) { this.activeFilter.set(filter); this.applyQuickFilter(filter); }
  applyQuickFilter(filter: string) { /* ... كما سبق */ }

  dateFrom = signal<Date>(new Date(2023, 7, 16));
  dateTo = signal<Date>(new Date(2023, 7, 29));

  // ----------------- Calendar Navigation -----------------
  leftMonth = signal(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  rightMonth = signal(new Date());

  prevMonth(month: 'left' | 'right') {
    if (month === 'left') this.leftMonth.set(new Date(this.leftMonth().getFullYear(), this.leftMonth().getMonth() - 1, 1));
    if (month === 'right') this.rightMonth.set(new Date(this.rightMonth().getFullYear(), this.rightMonth().getMonth() - 1, 1));
  }

  nextMonth(month: 'left' | 'right') {
    if (month === 'left') this.leftMonth.set(new Date(this.leftMonth().getFullYear(), this.leftMonth().getMonth() + 1, 1));
    if (month === 'right') this.rightMonth.set(new Date(this.rightMonth().getFullYear(), this.rightMonth().getMonth() + 1, 1));
  }

  generateMonth(date: Date): CalendarDay[][] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks: CalendarDay[][] = [];
    let week: CalendarDay[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      week.push({ date: new Date(year, month, 1 - (firstDay.getDay() - i)), current: false });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      week.push({ date: new Date(year, month, day), current: true });
      if (week.length === 7) { weeks.push(week); week = []; }
    }

    let nextDay = 1;
    while (week.length > 0 && week.length < 7) {
      week.push({ date: new Date(year, month + 1, nextDay++), current: false });
    }
    if (week.length) weeks.push(week);

    return weeks;
  }

  tempFrom: Date | null = null;
  tempTo: Date | null = null;

  onSelect(date: Date) {
    if (!this.tempFrom || (this.tempFrom && this.tempTo)) { this.tempFrom = date; this.tempTo = null; }
    else if (this.tempFrom && !this.tempTo) {
      if (date < this.tempFrom) { this.tempTo = this.tempFrom; this.tempFrom = date; }
      else this.tempTo = date;
    }
  }

  isSelected(date: Date): boolean {
    return !!(
      (this.tempFrom && date.getTime() === this.tempFrom.getTime()) ||
      (this.tempTo && date.getTime() === this.tempTo.getTime())
    );
  }

  isBetween(date: Date): boolean {
    return !!(
      this.tempFrom &&
      this.tempTo &&
      date.getTime() > this.tempFrom.getTime() &&
      date.getTime() < this.tempTo.getTime()
    );
  }

applyRange() {
  if (this.tempFrom) this.dateFrom.set(this.tempFrom);
  if (this.tempTo) this.dateTo.set(this.tempTo);
  console.log('Date From:', this.dateFrom());
  console.log('Date To:', this.dateTo());
  console.log('Selected Filter:', this.activeFilter());
}


  cancelRange() { this.tempFrom = null; this.tempTo = null; }
}
