import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { IClients } from '../Interface/iclients';

@Injectable({
  providedIn: 'root'
})
export class Clients {
  private API_URL = `${environment.apiUrl}Clients`;
  private _httpClient = inject(HttpClient);



  getAll(data: any): Observable<IResponseOf<IClients[]>> {


    return this._httpClient.post<IResponseOf<IClients[]>>(`${this.API_URL}/GetAll`, data);
  }
  getById(id: number): Observable<IResponseOf<IClients>> {
    return this._httpClient.get<IResponseOf<IClients>>(`${this.API_URL}/${id}`);
  }

  add(employee: FormData): Observable<any> {
    return this._httpClient.post(this.API_URL, employee);
  }

  update(id: number, employee: FormData): Observable<any> {
    return this._httpClient.put(`${this.API_URL}/${id}`, employee);
  }
  delete(id: number): Observable<any> {
    return this._httpClient.delete(`${this.API_URL}/${id}`);
  }

}
