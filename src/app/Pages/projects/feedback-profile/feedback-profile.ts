import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IFeedbackClients, IFeedbackEmployee } from '../../../Core/Interface/ifeedback';
import { FeedbackClientsService } from '../../../Core/service/Clients/feedback-clients.service';

@Component({
  selector: 'app-feedback-profile',
  imports: [CommonModule , DatePipe],
  templateUrl: './feedback-profile.html',
  styleUrl: './feedback-profile.scss'
})
export class FeedbackProfile {
    private _feedbackService = inject(FeedbackClientsService)
  Feedbacks = signal<IFeedbackClients>({} as IFeedbackClients);
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

    }
  }

}
