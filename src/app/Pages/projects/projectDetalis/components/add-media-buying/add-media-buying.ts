import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { MediaBuyingService } from '../../../../../Core/service/media-buying.service';
import { SweetAlert } from '../../../../../Core/service/sweet-alert';
import { GetMediaBuyingFields } from '../../../../../Core/Interface/ires-media-buying';
import { ShortNumberPipe } from '../../../../../Shared/pipes/short-number-pipe';

interface CalendarDay {
  date: Date;
  current: boolean;
}


enum CampaignType {
  Engagement = 0,
  Awareness = 1,
  Sales = 2
}

@Component({
  selector: 'app-add-media-buying',
  imports: [ReactiveModeuls , ShortNumberPipe],
  templateUrl: './add-media-buying.html',
  styleUrl: './add-media-buying.scss'
})
export class AddMediaBuying {
  private route = inject(ActivatedRoute);
  private _mediaService = inject(MediaBuyingService);
  private _alert = inject(SweetAlert);
  private Link = inject(Router);
  isLoading = signal(false);
  id = signal<any | null>(null);
  campaignType = signal<CampaignType>(CampaignType.Engagement);
  mediaBuyingStats = signal<GetMediaBuyingFields[]>([]);
  dateFrom = signal<string | null>(null);
  tempFrom = signal<Date | null>(null);
  leftMonth = signal(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));

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
    this.loadStats();
  }

  // ==========================
  // Load Stats
  // ==========================
  loadStats() {
    if (!this.id()) return;

    this._mediaService.GetMediaBuyingFields(this.id(), this.campaignType())
      .subscribe({
        next: res => this.mediaBuyingStats.set(res.value),
        error: err => this._alert.toast(err.error.detail, 'error')
      });
  }

  formatDate(d: Date): string {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
  }

  // ==========================
  // Calendar Navigation
  // ==========================
  prevMonth() {
    this.leftMonth.set(new Date(this.leftMonth().getFullYear(), this.leftMonth().getMonth() - 1, 1));
  }

  nextMonth() {
    this.leftMonth.set(new Date(this.leftMonth().getFullYear(), this.leftMonth().getMonth() + 1, 1));
  }

  generateMonth(date: Date): CalendarDay[][] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
 
    const weeks: CalendarDay[][] = [];
    let week: CalendarDay[] = [];

    for (let i = 0; i < first.getDay(); i++)
      week.push({ date: new Date(year, month, 1 - (first.getDay() - i)), current: false });

    for (let d = 1; d <= last.getDate(); d++) {
      week.push({ date: new Date(year, month, d), current: true });
      if (week.length === 7) { weeks.push(week); week = []; }
    }

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
    this.tempFrom.set(date);
    this.dateFrom.set(this.formatDate(date));
  }

  isSelected(date: Date): boolean {
    if (!this.tempFrom()) return false;
    return date.getTime() === this.tempFrom()!.getTime();
  }

  // ==========================
  // Apply Range (Send Date + Type + Stats)
  // ==========================
  applyRange() {
    if (!this.dateFrom()) {
      this._alert.toast('Please select a date', 'warning');
      return;
    }

    this.isLoading.set(true);
    const statsPayload = this.mediaBuyingStats().map((stat, index) => {
      const inputEl = document.querySelectorAll<HTMLInputElement>('.stat-card input')[index];
      return {
        mediaBuyingFieldId: stat.id.toString(), // تحويل ل string للتوافق مع الباك
        value: Number(inputEl?.value || 0)
      };
    });

    this._mediaService.addMediaBuyingFieldStats(
      this.id()!,
      this.campaignType(),
      this.dateFrom()!,
      statsPayload
    ).subscribe({
      next: res => {
        this._alert.toast('Saved successfully', 'success');
        this.isLoading.set(false);
        history.back()
        
      },

      error: err =>{ this._alert.toast(err.error.detail, 'error')
      this.isLoading.set(false);
      }
    });
  }

  // ==========================
  // Init
  // ==========================
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id.set(params.get('id'));
      this.loadStats();
    });
  }
}
