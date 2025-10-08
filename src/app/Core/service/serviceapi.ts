import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { IService } from '../Interface/iservice';

@Injectable({
  providedIn: 'root'
})
export class ServiceApi {
      private  API_URL = `${environment.apiUrl}Services`; 
      private _httpClient = inject(HttpClient);
    
  
  
 getAll(data: any): Observable<IResponseOf<IService[]>> {
  const params = new HttpParams({
    fromObject: {
        pageNumber: data.pageNumber ?? 1,
        pageSize: data.pageSize ?? 50,
    }
  });

  return this._httpClient.get<IResponseOf<IService[]>>(this.API_URL, { params });
}
  
    getById(id: number): Observable<IResponseOf<IService>> {
      return this._httpClient.get<IResponseOf<IService>>(`${this.API_URL}/${id}`);
    }
  
    add(service:any ): Observable<any> {
      return this._httpClient.post(this.API_URL, service);
    }
  
  update(id: number, service: IService): Observable<any> {
    return this._httpClient.put(`${this.API_URL}/${id}`, service);
  }
    delete(id: number): Observable<any> {
      return this._httpClient.delete(`${this.API_URL}/${id}`);
    }
  
}
