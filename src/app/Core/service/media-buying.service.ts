import { UpdateSummary } from './../../Pages/projects/projectDetalis/components/update-summary/update-summary';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { ISummary } from '../Interface/isummary';
import { GetMediaBuyingFields, IResMediaBuying } from '../Interface/ires-media-buying';

@Injectable({
  providedIn: 'root'
})
export class MediaBuyingService {
    private _httpClient = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}Projects`;
  addMediaBuyingField(projectId: string, campaignType: number,   fields: { id: string; type: number ; name: string}[]): Observable<any> {
    const url = `${this.baseUrl}/UpdateMediaBuyingField/${projectId}?campaignType=${campaignType}`;
    return this._httpClient.post(url, fields);
  }
  getSummary(projectId: string): Observable<IResponseOf<ISummary>> {
    const url = `${this.baseUrl}/GetSummary/${projectId}`;
    return this._httpClient.get<IResponseOf<ISummary>>(url);
  }
    UpdateSummary(projectId: string, request: string): Observable<any> {
      const url = `${this.baseUrl}/UpdateSummary/${projectId}`;
      const params = { request: request };

      return this._httpClient.post(url, {}, { params });
    }

  getFieldStats(projectId: string, campaignType: number, start: string | null, end: string | null): Observable<IResponseOf<IResMediaBuying>> {

    let params = new HttpParams()
      .set('campaignType', campaignType)
      .set('startDate', start ?? '')
      .set('endDate', end ?? '');

    return this._httpClient.get<IResponseOf<IResMediaBuying>>(`${this.baseUrl}/GetMediaBuyingFieldStats/${projectId}`, { params });
  }
GetMediaBuyingFields(projectId: string, campaignType: number): Observable<IResponseOf<GetMediaBuyingFields[]>> {
  return this._httpClient.get<IResponseOf<GetMediaBuyingFields[]>>(
    `${this.baseUrl}/GetMediaBuyingFields/${projectId}`,
    { params: { campaignType: campaignType.toString() } } // تبعت campaignType كـ query param
  );
}

addMediaBuyingFieldStats(
  projectId: string,
  campaignType: number,
  date: string,
  payload: { mediaBuyingFieldId: string; value: number }[]
): Observable<any> {
  return this._httpClient.post(
    `${this.baseUrl}/AddMediaBuyingFieldStats/${projectId}`,
    payload,
    { params: { campaignType: campaignType.toString(), Date: date } }
  );
}


}
