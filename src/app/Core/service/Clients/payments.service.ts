import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../../Shared/Interface/iresonse';
import { IPayments } from '../../Interface/ipayments';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
    private API_URL = `${environment.apiUrl}Clients`;
  private _httpClient = inject(HttpClient);

  getPayments(id: string, date: string): Observable<IResponseOf<IPayments[]>> {
    const url = `${this.API_URL}/GetPayments/${id}?date=${date}`;
    return this._httpClient.get<IResponseOf<IPayments[]>>(url);
  }
}
