import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IPayments } from '../Interface/ipayments';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentAdminService {
 private API_URL = `${environment.apiUrl}Projects`;
  private _httpClient = inject(HttpClient);

  getPayments( date: string): Observable<IResponseOf<IPayments[]>> {
    const url = `${this.API_URL}/GetPayments?date=${date}`;
    return this._httpClient.get<IResponseOf<IPayments[]>>(url);
  }

  addPayment(projectId: string, data: { amount: number; dateTime: string }): Observable<any> {
    return this._httpClient.post(`${this.API_URL}/AddPayment/${projectId}`, data);
  }

  togglePayment(paymentId: number, request: boolean): Observable<any> {
    const url = `${this.API_URL}/TogglePayment/${paymentId}?request=${request}`;
    return this._httpClient.post(url, {}); 
  }

}
