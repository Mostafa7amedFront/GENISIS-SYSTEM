import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../../Shared/Interface/iresonse';
import { IClients } from '../../Interface/iclients';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProflieService {
    private API_URL = `${environment.apiUrl}Clients`;
  private _httpClient = inject(HttpClient);
    getMy(): Observable<IResponseOf<IClients>> {
    return this._httpClient.get<IResponseOf<IClients>>(`${this.API_URL}/me`);
  }
}
