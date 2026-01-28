import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { IFeedbackClients, IFeedbackEmployee } from '../../../Core/Interface/ifeedback';
import { FeedbackClientsService } from '../../../Core/service/Clients/feedback-clients.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-feedbackclient',
  imports: [DatePipe, RouterLink],
  templateUrl: './feedbackclient.html',
  styleUrl: './feedbackclient.scss'
})
export class Feedbackclient {
 
  private _feedbackService = inject(FeedbackClientsService);

  Feedbacks = signal<IFeedbackClients>({} as IFeedbackClients);

  currentYear = new Date().getFullYear();

  // ✅ Input ID from parent
  @Input() id!: any;

ngOnChanges(changes: SimpleChanges): void {

  this._feedbackService.getAll(this.id).subscribe(res => {
    this.Feedbacks.set(res.value);
  });
}


}
