import { HttpClient } from '@angular/common/http';
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
    
  
  
    getAll(): Observable<IResponseOf<IService[]>> {
      return this._httpClient.get<IResponseOf<IService[]>>(`${this.API_URL}?pageNumber=1&pageSize=50`);
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
