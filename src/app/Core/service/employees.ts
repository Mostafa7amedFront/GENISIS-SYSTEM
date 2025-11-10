import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { IEmployee } from '../Interface/iemployee';

@Injectable({
  providedIn: 'root'
})
export class Employees {
  private API_URL = `${environment.apiUrl}Employees`;
  private _httpClient = inject(HttpClient);



  getAll(data: any): Observable<IResponseOf<IEmployee[]>> {
    const params = new HttpParams({
      fromObject: {
        pageNumber: data.pageNumber ?? 1,
        pageSize: data.pageSize ?? 50,
      }
    });

    return this._httpClient.get<IResponseOf<IEmployee[]>>(this.API_URL, { params });
  }
  getById(id: number): Observable<IResponseOf<IEmployee>> {
    return this._httpClient.get<IResponseOf<IEmployee>>(`${this.API_URL}/${id}`);
  }
  getMy(): Observable<IResponseOf<IEmployee>> {
    return this._httpClient.get<IResponseOf<IEmployee>>(`${this.API_URL}/me`);
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
