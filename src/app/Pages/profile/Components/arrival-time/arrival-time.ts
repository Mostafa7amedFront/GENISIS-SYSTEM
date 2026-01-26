import { Component, computed, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AttendanceService } from '../../../../Core/service/attendance.service.service';
import { AttendanceDayDto, DaySchedule } from '../../../../Core/Interface/iattendance';

@Component({
  selector: 'app-arrival-time',
  imports: [],
  templateUrl: './arrival-time.html',
  styleUrl: './arrival-time.scss'
})
export class ArrivalTime {
  private attendanceService = inject(AttendanceService);
  private route = inject(ActivatedRoute);

  months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL',
    'MAY', 'JUNE', 'JULY', 'AUGUST',
    'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  // 👇 will come from route
  employeeId = signal<string>('');

  // state
  currentMonthIndex = signal(new Date().getMonth());
  currentWeek = signal<number>(1);
// pagination meta from API
pageNumber = signal<number>(1);
pageSize = signal<number>(7);
totalPages = signal<number>(1);
totalCount = signal<number>(0);
hasPreviousPage = signal<boolean>(false);
hasNextPage = signal<boolean>(false);

// UI helpers
currentWeekLabel = computed(() => this.pageNumber()); // تعرض WEEK X
canPrevWeek = computed(() => this.hasPreviousPage());
canNextWeek = computed(() => this.hasNextPage());

// optional: show "Week x of y"
weekText = computed(() => `WEEK ${this.pageNumber()} / ${this.totalPages()}`);

  // date used for API
  selectedDate = signal<Date>(new Date());

  schedules = signal<DaySchedule[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  currentMonth = computed(() => this.months[this.currentMonthIndex()]);

  ngOnInit() {
    // ✅ read route param once
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg.set('EmployeeId is missing in route.');
      return;
    }
    this.employeeId.set(id);

    // initial load
    this.loadWeek();
  }

  // ✅ called from HTML or buttons
loadWeek() {
  this.loading.set(true);
  this.errorMsg.set(null);

  this.attendanceService
    .getWeeklyAttendance(this.employeeId(), this.selectedDate(), this.currentWeek())
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: (res) => {
        if (!res?.success) {
          this.errorMsg.set('Failed to load attendance.');
          this.schedules.set([]);
          return;
        }

        // ✅ schedules
        this.schedules.set((res.value ?? []).map(this.mapApiDayToSchedule));

        // ✅ pagination meta
        this.pageNumber.set(res.pageNumber ?? 1);
        this.pageSize.set(res.pageSize ?? 7);
        this.totalPages.set(res.totalPages ?? 1);
        this.totalCount.set(res.totalCount ?? 0);
        this.hasPreviousPage.set(!!res.hasPreviousPage);
        this.hasNextPage.set(!!res.hasNextPage);

        // ✅ sync currentWeek with pageNumber
        this.currentWeek.set(this.pageNumber());
      },
      error: (err) => {
        this.errorMsg.set(err?.message ?? 'Network error.');
        this.schedules.set([]);

        // reset meta on error
        this.pageNumber.set(1);
        this.totalPages.set(1);
        this.hasPreviousPage.set(false);
        this.hasNextPage.set(false);
      }
    });
}


  // ✅ update week from input or UI
  setWeekFromInput(value: string) {
    const week = Number(value);
    if (!Number.isFinite(week) || week < 1) return;
    this.currentWeek.set(week);
    this.loadWeek();
  }

  // ✅ update date from input (yyyy-MM-dd)
  setDateFromInput(value: string) {
    if (!value) return;
    this.selectedDate.set(new Date(value + 'T00:00:00'));
    this.loadWeek();
  }

  private mapApiDayToSchedule = (d: AttendanceDayDto): DaySchedule => {
    const dayUpper = (d.dayName ?? '').toUpperCase();
    const date = d.dayNumber ?? '';
    const statusLower = (d.status ?? '').toLowerCase();

    const time =
      d.timeInterval && d.timeInterval !== 'ABSENT' && d.timeInterval !== 'WEEKEND'
        ? d.timeInterval
        : (d.status?.toUpperCase() ?? d.timeInterval ?? '');

    let uiStatus: DaySchedule['status'] = 'normal';
    if (statusLower === 'absent' || (d.timeInterval ?? '').toUpperCase() === 'ABSENT') uiStatus = 'absent';
    if (statusLower === 'weekend' || (d.timeInterval ?? '').toUpperCase() === 'WEEKEND') uiStatus = 'weekend';

    return { date, day: dayUpper, time, status: uiStatus };
  };

nextWeek() {
  if (!this.hasNextPage()) return;
  this.currentWeek.update(v => v + 1);
  this.loadWeek();
}

prevWeek() {
  if (!this.hasPreviousPage()) return;
  this.currentWeek.update(v => v - 1);
  this.loadWeek();
}

nextMonth() {
  const d = new Date(this.selectedDate());
  d.setMonth(d.getMonth() + 1);

  this.selectedDate.set(d);
  this.currentMonthIndex.set(d.getMonth());

  this.currentWeek.set(1); // ✅ reset to first week
  this.loadWeek();
}

prevMonth() {
  const d = new Date(this.selectedDate());
  d.setMonth(d.getMonth() - 1);

  this.selectedDate.set(d);
  this.currentMonthIndex.set(d.getMonth());

  this.currentWeek.set(1); // ✅ reset to first week
  this.loadWeek();
}


}
