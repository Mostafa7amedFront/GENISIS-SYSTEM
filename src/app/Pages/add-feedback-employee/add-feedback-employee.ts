import { Component, inject } from '@angular/core';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';
import { ActivatedRoute } from '@angular/router';
import { FeedbackEmployeeService } from '../../Core/service/Employee/feedback-employee.service';
import { SweetAlert } from '../../Core/service/sweet-alert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-feedback-employee',
  imports: [ReactiveModeuls],
  templateUrl: './add-feedback-employee.html',
  styleUrl: './add-feedback-employee.scss'
})
export class AddFeedbackEmployee {
  form!: FormGroup;
  employeeId!: string;

  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _feedbackService = inject(FeedbackEmployeeService);
  private _alert = inject(SweetAlert);

  ngOnInit() {
    this.employeeId = this._route.snapshot.paramMap.get('id') || '';
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      feedback: ['', Validators.required],
      rate: [0, Validators.required]
    });
  }

  setRating(star: number) {
    this.form.patchValue({ rate: star });
  }

  submitFeedback() {
    if (this.form.invalid || this.form.value.rate === 0) {
      this._alert.toast('Please write a comment and select a rating before submitting', 'warning');
      return;
    }

    this._feedbackService.addFeedback(this.employeeId, this.form.value).subscribe({
      next: () => {
        this._alert.toast('Feedback submitted successfully ✅', 'success');
        this.form.reset({ feedback: '', rate: 0 });
        window.history.back();

      },
      error: () => {
        this._alert.toast('An error occurred while submitting feedback ❌', 'error');
      }
    });
  }
}
