import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { Submission, UpdateSubmissionPayload } from '../Interface/iproject';
import { environment } from '../../../environments/environment';
export interface MySubmission {
  id: string;
  projectId: string;
  submittedAt: string;
  status: number;
  quality: number | null;
  comment: string | null;
  attachmentUrls: string[];
}

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSubmissions(projectId: string): Observable<Submission[]> {
    return this.http
      .get<IResponseOf<Submission[]>>(
        `${this.baseUrl}Projects/GetSubmissions/${projectId}`
      )
      .pipe(map(res => res.value ?? []));
  }

  updateSubmission(submissionId: string, payload: UpdateSubmissionPayload) {
    return this.http.put<IResponseOf<any>>(
      `${this.baseUrl}Projects/EditSubmission/${submissionId}`,
      payload
    );
  }

  
  getMySubmissions(): Observable<MySubmission[]> {
    return this.http
      .get<IResponseOf<MySubmission[]>>( `${this.baseUrl}Employees/GetMySubmissions`)
      .pipe(map(res => res.value));
  }
}
