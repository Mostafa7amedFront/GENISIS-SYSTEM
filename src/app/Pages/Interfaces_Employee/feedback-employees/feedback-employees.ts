import { Component, inject, signal } from '@angular/core';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { FeedbackEmployeeService } from '../../../Core/service/Employee/feedback-employee.service';
import { IFeedback } from '../../../Core/Interface/iemployee';
import { IFeedbackEmployee } from '../../../Core/Interface/ifeedback';

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


  ngOnInit() {
    const storedId = localStorage.getItem('Id_Employees');

    if (storedId) {
      this._feedbackService.getAll(storedId).subscribe({
        next: (res) => {
          if (res.success) {
            this.Feedbacks.set(res.value);
          }
        },
        error: (err) => console.error('❌ Error loading feedback:', err)
      });
    }
  }

}
