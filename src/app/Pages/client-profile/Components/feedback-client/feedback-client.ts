import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FeedbackClientsService } from '../../../../Core/service/Clients/feedback-clients.service';
import { ActivatedRoute } from '@angular/router';
import { ReactiveModeuls } from '../../../../Shared/Modules/ReactiveForms.module';
import { IFeedbackClients } from '../../../../Core/Interface/ifeedback';

@Component({
  selector: 'app-feedback-client',
  imports: [ ReactiveModeuls],
  templateUrl: './feedback-client.html',
  styleUrl: './feedback-client.scss'
})
export class FeedbackClient {
    private _feedbackService = inject(FeedbackClientsService)
  Feedbacks = signal<IFeedbackClients>({} as IFeedbackClients);
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
    }
  }

}
