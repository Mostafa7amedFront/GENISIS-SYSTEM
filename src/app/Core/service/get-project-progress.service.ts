import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { IProjectProgressValue } from '../Interface/iproject-progress-value';

@Injectable({
  providedIn: 'root'
})
export class GetProjectProgressService {
 private readonly API_URL = `${environment.apiUrl}Projects`;
  private readonly _httpClient = inject(HttpClient);

  getProjectProgress(projectId: string) {
    return this._httpClient.get<IResponseOf<IProjectProgressValue>>(
      `${this.API_URL}/GetProjectProgress/${projectId}`
    );
  }
editProjectProgress(projectId: string, request: number) {
  return this._httpClient.put(
    `${this.API_URL}/EditProjectProgress/${projectId}?request=${request}` , {}
  );
}

}
