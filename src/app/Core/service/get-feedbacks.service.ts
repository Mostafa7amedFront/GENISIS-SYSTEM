import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { IFeedbackEmployee } from '../Interface/ifeedback';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetFeedbacksService {
    private API_URL = `${environment.apiUrl}Projects`;
  private _httpClient = inject(HttpClient);

  getAll(IdEmployee: string): Observable<IResponseOf<IFeedbackEmployee[]>> {
    return this._httpClient.get<IResponseOf<IFeedbackEmployee[]>>(
      `${this.API_URL}/GetProjectFeedbacks/${IdEmployee}`
    );
  }
    addProjectFeedback(projectId: string, feedback: {
    skillsRate: number;
    qualityOfRequirementsRate: number;
    meetingDeadlinesRate: number;
    communicationRate: number;
    overAllRate: number;
    questionTow: string;
    questionThree: number;
  }): Observable<IResponseOf<any>> {
    return this._httpClient.post<IResponseOf<any>>(
      `${this.API_URL}/AddProjectFeedback/${projectId}`,
      feedback
    );
  }
}
