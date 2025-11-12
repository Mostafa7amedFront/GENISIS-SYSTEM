import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../../Shared/Interface/iresonse';
import { AddFeedback, IFeedback } from '../../Interface/iemployee';
import { IFeedbackEmployee } from '../../Interface/ifeedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackEmployeeService {
  private API_URL = `${environment.apiUrl}Employees`;
  private _httpClient = inject(HttpClient);

  getAll(IdEmployee: string): Observable<IResponseOf<IFeedbackEmployee[]>> {
    return this._httpClient.get<IResponseOf<IFeedbackEmployee[]>>(
      `${this.API_URL}/GetFeedbacks/${IdEmployee}`
    );
  }


    addFeedback(employeeId: string, data: AddFeedback): Observable<IResponseOf<any>> {
    return this._httpClient.post<IResponseOf<any>>(
      `${this.API_URL}/AddFeedback/${employeeId}`,
      data
    );
  }
}
