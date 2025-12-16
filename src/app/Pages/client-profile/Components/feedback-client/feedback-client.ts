import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FeedbackClientsService } from '../../../../Core/service/Clients/feedback-clients.service';
import { IFeedbackEmployee } from '../../../../Core/Interface/ifeedback';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback-client',
  imports: [CommonModule],
  templateUrl: './feedback-client.html',
  styleUrl: './feedback-client.scss'
})
export class FeedbackClient {
    private _feedbackService = inject(FeedbackClientsService)
  Feedbacks = signal<IFeedbackEmployee[] | null>(null);
    private _route = inject(ActivatedRoute);

currentYear = new Date().getFullYear();
 clientId!:any

  ngOnInit() {
      const idParam = this._route.snapshot.paramMap.get('id');

    this.clientId = idParam;
    if (idParam) {
      this._feedbackService.getAll(idParam).subscribe({
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
