import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../../Shared/Interface/iresonse';
import { IClients } from '../../Interface/iclients';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MeetingService {
    private API_URL = `${environment.apiUrl}Projects/AddMeeting/`;
  private _httpClient = inject(HttpClient);
  addMeeting(projectId: string, date: string, time: number): Observable<any> {
    const url = `${this.API_URL}${projectId}`;
    const body = { date, time };
    return this._httpClient.post(url, body);
  }
}
