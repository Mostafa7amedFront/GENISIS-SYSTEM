import { Component, inject, signal } from '@angular/core';
import { IFeedbackEmployee } from '../../../Core/Interface/ifeedback';
import { FeedbackClientsService } from '../../../Core/service/Clients/feedback-clients.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feedbackclient',
  imports: [DatePipe],
  templateUrl: './feedbackclient.html',
  styleUrl: './feedbackclient.scss'
})
export class Feedbackclient {
  private _feedbackService = inject(FeedbackClientsService)
  Feedbacks = signal<IFeedbackEmployee[] | null>(null);
currentYear = new Date().getFullYear();


  ngOnInit() {
    const storedId = localStorage.getItem("Id_Clients");

    if (storedId) {
      this._feedbackService.getAll(storedId).subscribe({
        next: (res) => {
          if (res.success) {
            this.Feedbacks.set(res.value);
          }
        },
        error: (err) => console.error('❌ Error loading feedback:', err)
      });
    } else {
      console.warn('⚠️ No employeeId found in localStorage');
    }
  }

}
