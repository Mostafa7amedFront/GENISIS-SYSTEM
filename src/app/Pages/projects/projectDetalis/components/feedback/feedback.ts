import { Component, inject, signal } from '@angular/core';
import { IFeedbackEmployee } from '../../../../../Core/Interface/ifeedback';
import { ActivatedRoute } from '@angular/router';
import { GetFeedbacksService } from '../../../../../Core/service/get-feedbacks.service';
import { CommonModule } from '@angular/common';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';

@Component({
  selector: 'app-feedback',
  imports: [ReactiveModeuls],
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
        error: (err) => {}
      });    }
   else {
    }
  }
}
