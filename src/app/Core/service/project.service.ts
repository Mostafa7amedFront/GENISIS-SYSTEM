import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IPaginationResponse, IResponseOf, IResponsePage } from '../../Shared/Interface/iresonse';
import { GetAllProjectsStats, IProject, Note, ProjectsValue } from '../Interface/iproject';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private API_URL = `${environment.apiUrl}Projects`;
  private _httpClient = inject(HttpClient);
  private API_URL_Note = `${environment.apiUrl}`;

  getAll(data: any): Observable<IResponsePage<ProjectsValue>> {
    return this._httpClient.post<IResponsePage<ProjectsValue>>(`${this.API_URL}/GetAll`, data);
  }
  getProjectClient(data: { pageNumber?: number; pageSize?: number; clientId?: any }): Observable<IPaginationResponse<IProject>> {
    const params = new HttpParams({
      fromObject: {
        pageNumber: data.pageNumber ?? 1,
        pageSize: data.pageSize ?? 50,
        clientId: data.clientId ?? '0',

      },
    });
    return this._httpClient.get<IPaginationResponse<IProject>>(`${this.API_URL}/GetAssignedProjects`, { params });
  }
  getStatusProject(): Observable<IResponseOf<GetAllProjectsStats>> {

    return this._httpClient.get<IResponseOf<GetAllProjectsStats>>(`${this.API_URL}/GetAllProjectsStats`);
  }

getProjectEmployee(data: { pageNumber?: number; pageSize?: number; employeeId?: string }): Observable<IPaginationResponse<IProject>> {
  const params = new HttpParams({
    fromObject: {
      pageNumber: data.pageNumber?.toString() ?? '1',
      pageSize: data.pageSize?.toString() ?? '50',
      employeeId: data.employeeId ?? '0',
    },
  });

  return this._httpClient.get<IPaginationResponse<IProject>>(`${this.API_URL}/GetAssignedProjects`, { params });
}

editProjectStatus(projectId: string, status: number) {
  return this._httpClient.put(
    `${this.API_URL}/EditProjectStatus/${projectId}`,
    null,
    {
      params: {
        request: status
      }
    }
  );
}


  getById(id: any): Observable<IResponseOf<IProject>> {
    return this._httpClient.get<IResponseOf<IProject>>(`${this.API_URL}/GetOneProject/${id}`);
  }

  add(Project: any): Observable<any> {
    return this._httpClient.post(this.API_URL, Project);
  }

  update(id: string, employee: FormData): Observable<any> {
    return this._httpClient.put(`${this.API_URL}/${id}`, employee);
  }

  updateProject(
    id: string,
    title: string,
    desc: string,
    status: number,
    deadline: string,
    formData: FormData
  ): Observable<any> {
    const url = `${this.API_URL}/${id}?ProjectTitle=${encodeURIComponent(title)}&ProjectDescription=${encodeURIComponent(desc)}&ProjectStatus=${status}&DeadLine=${encodeURIComponent(deadline)}`;
    return this._httpClient.put(url, formData);
  }

  delete(id: string): Observable<any> {
    return this._httpClient.delete(`${this.API_URL}/${id}`);
  }

  uploadMultipleRequests(projectId: string, files: File[]): Observable<any> {
    const url = `${this.API_URL}/AddSubmission/${projectId}`;
    const formData = new FormData();
    files.forEach(file => {
      formData.append('Attachments', file);
    });
    return this._httpClient.post(url, formData);
  }


}
