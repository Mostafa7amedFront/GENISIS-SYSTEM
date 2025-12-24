import { ActivatedRoute, Router } from '@angular/router';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { MediaBuyingService } from '../../../../../Core/service/media-buying.service';
import { MediaBuyingFieldStat } from '../../../../../Core/Interface/ires-media-buying';
import { ShortNumberPipe } from '../../../../../Shared/pipes/short-number-pipe';
import { SweetAlert } from '../../../../../Core/service/sweet-alert';

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
  imports: [ReactiveModeuls , ShortNumberPipe],
  templateUrl: './media-buying.html',
  styleUrls: ['./media-buying.scss'],
})
export class MediaBuying {
 
  private route = inject(ActivatedRoute);
  private _mediaService = inject(MediaBuyingService);
  private _alert = inject(SweetAlert);
  private Link = inject(Router);

  // 🔵 كل المتغيرات Signals
  id = signal<any | null>(null);

  campaignType = signal<CampaignType>(CampaignType.Engagement);
  mediaBuyingStats = signal<MediaBuyingFieldStat[]>([]);

  summary = signal<string>('');
  updatedOn = signal<string>('');
  isSelectedDate = signal<boolean>(true);

  activeFilter = signal<string | null>(null);

  dateFrom = signal<string | null>(null);
  dateTo = signal<string | null>(null);

  leftMonth = signal(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  rightMonth = signal(new Date());

  // 🔥 tempFrom & tempTo بقيوا Signals
  tempFrom = signal<Date | null>(null);
  tempTo = signal<Date | null>(null);

  quickFilters = [
    'Today','Yesterday','Last 7 days','Last 30 days','Last 90 days',
    'Last 365 days','Last 12 months','Last Year'
  ];

  // ==========================
  // Campaign Type
  // ==========================
  selectCampaign(value: 'Sales' | 'Awareness' | 'Engagement') {
    const map = {
      Engagement: CampaignType.Engagement,
      Awareness: CampaignType.Awareness,
      Sales: CampaignType.Sales,
    };
    this.campaignType.set(map[value]);
  }

  // ==========================
  // Load Summary
  // ==========================
  loadSummary() {
    this._mediaService.getSummary(this.id()).subscribe({
      next: (res) => {
        this.summary.set(res.value.summary);
        this.updatedOn.set(res.value.updatedOn);
      },
      error: err => console.log(err)
    });
  }

  // ==========================
  // Quick Filters
  // ==========================
  selectFilter(filter: string) {
    this.activeFilter.set(filter);
    this.applyQuickFilter(filter);
    this.isSelectedDate.set(false);
  }

  formatDate(d: Date): string {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
  }

  applyQuickFilter(filter: string) {

    this.cancelRange();

    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (filter) {
      case 'Today': startDate = today; endDate = today; break;
      case 'Yesterday':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(startDate);
      break;
      case 'Last 7 days': startDate.setDate(today.getDate() - 7); break;
      case 'Last 30 days': startDate.setDate(today.getDate() - 30); break;
      case 'Last 90 days': startDate.setDate(today.getDate() - 90); break;
      case 'Last 365 days': startDate.setDate(today.getDate() - 365); break;
      case 'Last 12 months':
        startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      break;
      case 'Last Year':
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
    }

    this.dateFrom.set(this.formatDate(startDate));
    this.dateTo.set(this.formatDate(endDate));
    this.activeFilter.set(filter);
  }

  // ==========================
  // Time Ago
  // ==========================
  timeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  }

  // ==========================
  // Calendar Navigation
  // ==========================
  prevMonth(side: 'left' | 'right') {
    if (side === 'left')
      this.leftMonth.set(new Date(this.leftMonth().getFullYear(), this.leftMonth().getMonth() - 1, 1));

    else
      this.rightMonth.set(new Date(this.rightMonth().getFullYear(), this.rightMonth().getMonth() - 1, 1));
  }

  readonly summaryText = computed(() =>
  this.summary().trim() || 'No summary available'
);
  nextMonth(side: 'left' | 'right') {
    if (side === 'left')
      this.leftMonth.set(new Date(this.leftMonth().getFullYear(), this.leftMonth().getMonth() + 1, 1));

    else
      this.rightMonth.set(new Date(this.rightMonth().getFullYear(), this.rightMonth().getMonth() + 1, 1));
  }

  generateMonth(date: Date): CalendarDay[][] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const weeks: CalendarDay[][] = [];
    let week: CalendarDay[] = [];

    // Days before month
    for (let i = 0; i < first.getDay(); i++)
      week.push({ date: new Date(year, month, 1 - (first.getDay() - i)), current: false });

    // Days of month
    for (let d = 1; d <= last.getDate(); d++) {
      week.push({ date: new Date(year, month, d), current: true });
      if (week.length === 7) { weeks.push(week); week = []; }
    }

    // Fill next month days
    let next = 1;
    while (week.length && week.length < 7)
      week.push({ date: new Date(year, month + 1, next++), current: false });

    if (week.length) weeks.push(week);
    return weeks;
  }

  // ==========================
  // Select Date
  // ==========================
  onSelect(date: Date) {
    this.activeFilter.set(null);

    if (!this.tempFrom() || (this.tempFrom() && this.tempTo())) {
      this.tempFrom.set(date);
      this.tempTo.set(null);
      this.dateFrom.set(this.formatDate(date));
      this.dateTo.set(null);
    }
    else if (this.tempFrom() && !this.tempTo()) {

      if (date < this.tempFrom()!) {
        this.tempTo.set(this.tempFrom());
        this.tempFrom.set(date);
      } else {
        this.tempTo.set(date);
      }

      this.dateFrom.set(this.formatDate(this.tempFrom()!));
      this.dateTo.set(this.formatDate(this.tempTo()!));
    }
  }

  isSelected(date: Date): boolean {
    return (
      (this.tempFrom() && date.getTime() === this.tempFrom()!.getTime()) ||
      (this.tempTo() && date.getTime() === this.tempTo()!.getTime())
    )!;
  }

  isBetween(date: Date): boolean {
    return (
      this.tempFrom() &&
      this.tempTo() &&
      date.getTime() > this.tempFrom()!.getTime() &&
      date.getTime() < this.tempTo()!.getTime()
    )!;
  }

  // ==========================
  // Apply Range
  // ==========================
  applyRange() {
    const payload = {
      campaignType: this.campaignType(),
      startDate: this.dateFrom(),
      endDate: this.dateTo() !== this.dateFrom() ? this.dateTo() : null
    };

    this._mediaService.getFieldStats(
      this.id(),
      payload.campaignType,
      payload.startDate,
      payload.endDate
    ).subscribe({
      next: res => this.mediaBuyingStats.set(res.value.mediaBuyingFieldStats),
      error: err => this._alert.toast(err.error.detail,'error')
    });
  }

  cancelRange() {
    this.tempFrom.set(null);
    this.tempTo.set(null);
    this.dateFrom.set(null);
    this.dateTo.set(null);
    this.isSelectedDate.set(true);
    this.activeFilter.set(null);

  }
  addMedia(){
    this.Link.navigate(['/employee/add-media-buying', this.id()]);
  }

  // ==========================
  // Init
  // ==========================
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id.set(params.get('id'));

      this.loadSummary();

      const today = this.formatDate(new Date());
      this.dateFrom.set(today);
      this.dateTo.set(null);

      this.applyRange();
    });
  }
}
