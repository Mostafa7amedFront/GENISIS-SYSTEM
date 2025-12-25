import { ChangeDetectorRef, Component, inject } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { GetFeedbacksService } from '../../Core/service/get-feedbacks.service';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';

interface IRating {
  skills: number;
  quality: number;
  deadlines: number;
  communication: number;
  satisfaction: number;
}

@Component({
  selector: 'app-get-feedback',
  imports: [ReactiveModeuls],
  templateUrl: './get-feedback.html',
  styleUrl: './get-feedback.scss'
})
export class GetFeedback {
  private _route = inject(ActivatedRoute);
  private _feedbackService = inject(GetFeedbacksService);
private cdr = inject(ChangeDetectorRef);

  projectId: string = '';

  // Strong typing
  ratings: IRating = {
    skills: 0,
    quality: 0,
    deadlines: 0,
    communication: 0,
    satisfaction: 0
  };

  feedbackText: string = '';
  recommendation: string = '';

  ngOnInit() {
    this.projectId = this._route.snapshot.paramMap.get('id') || '';
    this.GetFeedback();
  }

  GetFeedback() {
    this._feedbackService.getOneFeedback(this.projectId).subscribe({
      next: (res) => {
        const fb = res.value;

        // ⭐ Ratings
        this.ratings = {
          skills: fb.skillsRate,
          quality: fb.qualityOfRequirementsRate,
          deadlines: fb.meetingDeadlinesRate,
          communication: fb.communicationRate,
          satisfaction: fb.overAllRate
        };

        // ⭐ Question 02
        this.feedbackText = fb.questionTow;

        // ⭐ Question 03
        this.recommendation = this.mapRecommendation(fb.questionThree);
      this.cdr.detectChanges();

      },
      error: (err) =>{}
    });
  }

  // 🔥 Convert number to label
  mapRecommendation(value: number): string {
    switch (value) {
      case 1: return 'Unlikely';
      case 2: return 'Maybe';
      case 3: return 'Likely';
      case 4: return 'Very Likely';
      default: return '';
    }
  }

  setRating(category: keyof IRating, value: number) {
    this.ratings[category] = this.ratings[category] === value ? 0 : value;
  }

  setRecommendation(option: string) {
    this.recommendation = this.recommendation === option ? '' : option;
  }
}
