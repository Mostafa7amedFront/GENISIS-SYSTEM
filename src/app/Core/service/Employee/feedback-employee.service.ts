import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IResponseOf } from '../../../Shared/Interface/iresonse';
import { AddFeedback, IFeedback } from '../../Interface/iemployee';
import { IFeedbackClients, IFeedbackEmployee } from '../../Interface/ifeedback';
import { IApiResponse, IMyProjectsValue } from '../../Interface/iproject-employee';

@Injectable({
  providedIn: 'root'
})
export class FeedbackEmployeeService {
  private API_URL = `${environment.apiUrl}Employees`;
  private _httpClient = inject(HttpClient);

  getAll(IdEmployee: string): Observable<IResponseOf<IFeedbackClients>> {
    return this._httpClient.get<IResponseOf<IFeedbackClients>>(
      `${this.API_URL}/GetFeedbacks/${IdEmployee}`
    );
  }


    addFeedback(employeeId: string, data: AddFeedback): Observable<IResponseOf<any>> {
    return this._httpClient.post<IResponseOf<any>>(
      `${this.API_URL}/AddFeedback/${employeeId}`,
      data
    );
  }

    getMyProjects(): Observable<IMyProjectsValue> {
    return this._httpClient
      .get<IApiResponse<IMyProjectsValue>>(`${this.API_URL}/my-projects`)
      .pipe(map(res => res.value));
  }

}
