import { Component, inject, signal } from '@angular/core';
import { GetFeedbacksService } from '../../../../../Core/service/get-feedbacks.service';
import { IFeedbackEmployee } from '../../../../../Core/Interface/ifeedback';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feedback',
  imports: [DatePipe],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss'
})
export class Feedback {
private _feedbackService = inject(GetFeedbacksService)
  Feedbacks = signal<IFeedbackEmployee[] | null>(null);
currentYear = new Date().getFullYear();
  private _route = inject(ActivatedRoute);
projectId!:any;
  
  ngOnInit() {
    const idParam = this._route.snapshot.paramMap.get('id');

    this.projectId = idParam;
    if (this.projectId) {
 this._feedbackService.getAll(this.projectId).subscribe({
        next: (res) => {
          if (res.success) {
            this.Feedbacks.set(res.value);
          }
        },
        error: (err) => console.error('❌ Error loading feedback:', err)
      });    }
   else {
    }
  }
}
