import { Component, signal } from '@angular/core';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';

interface CalendarDay {
  date: Date;
  current: boolean; // هل اليوم ينتمي للشهر الحالي؟
}
enum CampaignType {
  Engagement = 0,
  Awareness = 1,
  Sales = 2
}
@Component({
  selector: 'app-media-buying',
  imports: [ReactiveModeuls],
  templateUrl: './media-buying.html',
  styleUrls: ['./media-buying.scss'],
})
export class MediaBuying {
campaignType = signal<CampaignType>(CampaignType.Sales);
selectCampaign(value: 'Engagement' | 'Awareness' | 'Sales') {
  const map = {
    Engagement: CampaignType.Engagement,
    Awareness:   CampaignType.Awareness,
    Sales:       CampaignType.Sales,
  };

  this.campaignType.set(map[value]);

  console.log("Selected:", value, "→ Code:", this.campaignType());
}

  quickFilters = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days', 'Last 12 months', 'Last Year'];
activeFilter = signal<string | null>(null);
  selectFilter(filter: string) { this.activeFilter.set(filter); this.applyQuickFilter(filter); }
applyQuickFilter(filter: string) {
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (filter) {
    case 'Today':
      startDate = new Date(today);
      break;

    case 'Yesterday':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      endDate = new Date(startDate);
      break;

    case 'Last 7 days':
      startDate.setDate(today.getDate() - 7);
      break;

    case 'Last 30 days':
      startDate.setDate(today.getDate() - 30);
      break;

    case 'Last 90 days':
      startDate.setDate(today.getDate() - 90);
      break;

    case 'Last 365 days':
      startDate.setDate(today.getDate() - 365);
      break;

    case 'Last 12 months':
      startDate.setFullYear(today.getFullYear() - 1);
      break;

    case 'Last Year':
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
  }
    this.cancelRange();

  this.dateFrom.set(startDate);
  this.dateTo.set(endDate);
  this.activeFilter.set(filter);

}

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
      this.activeFilter.set(null);

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



  // ابعت 
  this.sendToBackend();
}

sendToBackend() {
    const from = this.dateFrom();
  const to = this.dateTo();

  const payload = {
    campaignType: this.campaignType(),
    from: `${from.getFullYear()}-${(from.getMonth()+1).toString().padStart(2,'0')}-${from.getDate().toString().padStart(2,'0')}`,
    to: `${to.getFullYear()}-${(to.getMonth()+1).toString().padStart(2,'0')}-${to.getDate().toString().padStart(2,'0')}`,
  };

  console.log("📤 Payload to backend:", payload);


}
  cancelRange() { this.tempFrom = null; this.tempTo = null; }
}
