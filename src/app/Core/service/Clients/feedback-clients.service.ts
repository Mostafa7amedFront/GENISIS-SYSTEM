import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../../Shared/Interface/iresonse';
import { IFeedbackClients } from '../../Interface/ifeedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackClientsService {
  private API_URL = `${environment.apiUrl}Clients`;
  private _httpClient = inject(HttpClient);

  getAll(IdEmployee: string): Observable<IResponseOf<IFeedbackClients>> {
    return this._httpClient.get<IResponseOf<IFeedbackClients>>(
      `${this.API_URL}/GetFeedbacks/${IdEmployee}`
    );
  }
}
