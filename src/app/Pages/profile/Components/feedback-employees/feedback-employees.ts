import { Component, inject, signal } from '@angular/core';
import { ReactiveModeuls } from '../../../../Shared/Modules/ReactiveForms.module';
import { FeedbackEmployeeService } from '../../../../Core/service/Employee/feedback-employee.service';
import { IFeedbackEmployee } from '../../../../Core/Interface/ifeedback';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback-employees',
  imports: [ReactiveModeuls],
  templateUrl: './feedback-employees.html',
  styleUrl: './feedback-employees.scss'
})
export class FeedbackEmployees {

  private _feedbackService = inject(FeedbackEmployeeService)
  Feedbacks = signal<IFeedbackEmployee[] | null>(null);
currentYear = new Date().getFullYear();
    private _route = inject(ActivatedRoute);
storedId!:any;

  ngOnInit() {
      const idParam = this._route.snapshot.paramMap.get('id');

    this.storedId = idParam;
    if (this.storedId) {
      this._feedbackService.getAll(this.storedId).subscribe({
        next: (res) => {
          if (res.success) {
            this.Feedbacks.set(res.value);
          }
        },
        error: (err) =>{}
      });
    } else {
    }
  }

}
