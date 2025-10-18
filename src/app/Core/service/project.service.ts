import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponseOf } from '../../Shared/Interface/iresonse';
import { IProject, Note } from '../Interface/iproject';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private API_URL = `${environment.apiUrl}Projects`;
  private _httpClient = inject(HttpClient);
  private API_URL_Note = `${environment.apiUrl}`;

  getAll(data: any): Observable<IResponseOf<IProject[]>> {
    const params = new HttpParams({
      fromObject: {
          pageNumber: data.pageNumber ?? 1,
          pageSize: data.pageSize ?? 50,
      }
    });

    return this._httpClient.get<IResponseOf<IProject[]>>(this.API_URL, { params });
  }
  getProjectClient(clientId: number): Observable<IResponseOf<IProject[]>> {
    return this._httpClient.get<IResponseOf<IProject[]>>(`${this.API_URL}?clientId=${clientId}`);
  }
  getProjectEmployee(employeeId: number): Observable<IResponseOf<IProject[]>> {
    return this._httpClient.get<IResponseOf<IProject[]>>(
      `${this.API_URL}?employeeId=${employeeId}`
    );
  }
  getById(id: number): Observable<IResponseOf<IProject>> {
    return this._httpClient.get<IResponseOf<IProject>>(`${this.API_URL}/${id}`);
  }

  add(Project: any): Observable<any> {
    return this._httpClient.post(this.API_URL, Project);
  }

  update(id: number, employee: FormData): Observable<any> {
    return this._httpClient.put(`${this.API_URL}/${id}`, employee);
  }
  delete(id: string): Observable<any> {
    return this._httpClient.delete(`${this.API_URL}/${id}`);
  }
  uploadMultipleRequests(projectId: string, files: File[]): Observable<any> {
    const url = `${this.API_URL}/AddAttacment/${projectId}`;
    const formData = new FormData();

    files.forEach(file => {
      const requestObj = { file: file.name };
      formData.append('request', JSON.stringify(requestObj));
    });

    return this._httpClient.post(url, formData);
  }


  editNote(
    noteId: number,
    data: { note: string; isFav: boolean; isCompleted: boolean }
  ): Observable<any> {
    return this._httpClient.post(`${this.API_URL}/EditNote/${noteId}`, data);
  }


  addNote(projectId: string, data: Note): Observable<any> {
    return this._httpClient.post(`${this.API_URL}/AddNote/${projectId}`, {
      note: data.noteContent,
      isFav: data.isFav,
      isCompleted: data.isCompleted
    });
  }
}
