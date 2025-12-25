import { Component, inject } from '@angular/core';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { ActivatedRoute, Router } from '@angular/router';
import { GetFeedbacksService } from '../../../Core/service/get-feedbacks.service';
import { SweetAlert } from '../../../Core/service/sweet-alert';

interface IRating {
  skills: number;
  quality: number;
  deadlines: number;
  communication: number;
  satisfaction: number;
}
@Component({
  selector: 'app-feed-back-page',
  imports: [ReactiveModeuls],
  templateUrl: './feed-back-page.html',
  styleUrl: './feed-back-page.scss'
})
export class FeedBackPage {
  private _route = inject(ActivatedRoute);
  private _feedbackService = inject(GetFeedbacksService);
  private _alert = inject(SweetAlert);
  private _routes = inject(Router);

  projectId: string = '';

  // ✅ Strongly typed ratings (fixes TS4111)
  ratings: IRating = {
    skills: 0,
    quality: 0,
    deadlines: 0,
    communication: 0,
    satisfaction: 0
  };

  // Question 02
  feedbackText: string = '';

  // Question 03
  recommendation: string = '';

  ngOnInit() {
    this.projectId = this._route.snapshot.paramMap.get('id') || '';
  }

  setRating(category: keyof IRating, value: number) {
    this.ratings[category] = this.ratings[category] === value ? 0 : value;
  }

  setRecommendation(option: string) {
    this.recommendation = this.recommendation === option ? '' : option;
  }

  submitFeedback() {
    if (!this.projectId) {
      this._alert.toast('Project ID not found.', 'error');

      return;
    }

    let recValue = 0;
    switch (this.recommendation) {
      case 'Unlikely':
        recValue = 1;
        break;
      case 'Maybe':
        recValue = 2;
        break;
      case 'Likely':
        recValue = 3;
        break;
      case 'Very Likely':
        recValue = 4;
        break;
      default:
        recValue = 0;
    }

    const feedbackPayload = {
      skillsRate: this.ratings.skills,
      qualityOfRequirementsRate: this.ratings.quality,
      meetingDeadlinesRate: this.ratings.deadlines,
      communicationRate: this.ratings.communication,
      overAllRate: this.ratings.satisfaction,
      questionTow: this.feedbackText,
      questionThree: recValue
    };

    this._feedbackService.addProjectFeedback(this.projectId, feedbackPayload).subscribe({
      next: res => {
        this._alert.toast('Feedback submitted successfully!', 'success');
        this._routes.navigate(['/client/feedback']);
      },
      error: err => {
        this._alert.toast('Failed to submit feedback', 'error');

      }
    });
  }
}
