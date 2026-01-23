import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';
import { FeedbackEmployeeService } from '../../Core/service/Employee/feedback-employee.service';
import { SweetAlert } from '../../Core/service/sweet-alert';

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
      overallPerformance: [0, Validators.required],
      attentionToDetails: [0, Validators.required]
    });
  }

  setRating(
    controlName: 'overallPerformance' | 'attentionToDetails',
    value: number
  ) {
    this.form.patchValue({ [controlName]: value });
  }

  submitFeedback() {
    if (
      this.form.invalid ||
      this.form.value.overallPerformance === 0 ||
      this.form.value.attentionToDetails === 0
    ) {
      this._alert.toast(
        'Please write feedback and select all ratings',
        'warning'
      );
      return;
    }

    const payload = {
      feedback: this.form.value.feedback,
      overallPerformance: this.form.value.overallPerformance,
      attentionToDetails: this.form.value.attentionToDetails
    };

    this._feedbackService.addFeedback(this.employeeId, payload).subscribe({
      next: () => {
        this._alert.toast('Feedback submitted successfully ✅', 'success');
        this.form.reset({
          feedback: '',
          overallPerformance: 0,
          attentionToDetails: 0
        });
        window.history.back();
      },
      error: () => {
        this._alert.toast('An error occurred while submitting feedback ❌', 'error');
      }
    });
  }
}
