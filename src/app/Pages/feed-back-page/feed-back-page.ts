import { Component } from '@angular/core';
import { ReactiveModeuls } from '../../Shared/Modules/ReactiveForms.module';

@Component({
  selector: 'app-feed-back-page',
  imports: [ReactiveModeuls],
  templateUrl: './feed-back-page.html',
  styleUrl: './feed-back-page.scss'
})
export class FeedBackPage {

  // Question 01 ratings
  ratings: { [key: string]: number } = {
    skills: 0,
    quality: 0,
    deadlines: 0,
    communication: 0,
    satisfaction: 0
  };

  // Question 02 text
  feedbackText: string = '';

  // Question 03 choice
  recommendation: string = '';

  setRating(category: string, value: number) {
    this.ratings[category] = (this.ratings[category] === value) ? 0 : value;
  }

  setRecommendation(option: string) {
    this.recommendation = (this.recommendation === option) ? '' : option;
  }
  

  submitFeedback() {

  }
}
