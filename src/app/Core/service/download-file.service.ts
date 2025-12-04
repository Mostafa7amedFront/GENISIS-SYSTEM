import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
    private baseUrl = `${environment.apiUrl}Files/download`;
    private _httpClient = inject(HttpClient);

  downloadFile(fileUrl: string): Observable<Blob> {
    return this._httpClient.get(`${this.baseUrl}?fileUrl=${encodeURIComponent(fileUrl)}`, {
      responseType: 'blob'
    });
  }
}
