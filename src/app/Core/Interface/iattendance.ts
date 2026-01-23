export interface WeeklyAttendanceResponse {
  success: boolean;
  value: AttendanceDayDto[];
}

export interface AttendanceDayDto {
  dayName: string;      // "Sunday"
  dayNumber: string;    // "28"
  status: string;       // "Absent" | "Weekend" | ...
  timeInterval: string; // "ABSENT" | "WEEKEND" | "12:30 PM - 1:00 PM" (depends on API)
}

export interface DaySchedule {
  date: string;
  day: string;
  time: string;
  status?: 'normal' | 'absent' | 'highlight' | 'weekend';
}
export interface QrResponse {
  success: boolean;
  value: string; 
}
export interface ScanAttendanceResponse {
  success: boolean;
  message?: string;
  value: {
    employeeId: string;
    date: string;
    firstIn: string | null;
    lastOut: string | null;
    status: number;
    isPenaltyApplied: boolean;
    systemNote: string | null;
  };
}