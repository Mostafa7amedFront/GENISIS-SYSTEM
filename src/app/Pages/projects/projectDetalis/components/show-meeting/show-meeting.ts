import { Component, inject, signal } from '@angular/core';
import { MeetingService } from '../../../../../Core/service/Clients/meeting.service';
import { environment } from '../../../../../../environments/environment';
import { IMeeting } from '../../../../../Core/Interface/imeeting';
import { ActivatedRoute } from '@angular/router';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-show-meeting',
  imports: [ReactiveModeuls ],
  templateUrl: './show-meeting.html',
  styleUrl: './show-meeting.scss'
})
export class ShowMeeting {
  private _meeting = inject(MeetingService);

  // Meetings data
  meetings = signal<IMeeting[]>([]);

  // Calendar
  currentDate = new Date();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) this.loadMeetings(projectId);
      else console.warn('⚠️ Route param "id" not found');
    });
  }

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

formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
  return `${day}, ${month}`;
}
  private loadMeetings(projectId: string): void {
    this._meeting.getMeeting(projectId).subscribe({
      next: (res) => {
        this.meetings.set(res.value);
        console.log(this.meetings)
      },
      error: err => console.error('❌ Error fetching meetings:', err)
    });
  }

}
