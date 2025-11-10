import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Note, NoteReq } from '../Interface/iproject';
import { IResponseOf } from '../../Shared/Interface/iresonse';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private _httpClient = inject(HttpClient);
  private API_URL_Note = `${environment.apiUrl}Projects`;

  getProjectNotes(projectID: number): Observable<IResponseOf<Note[]>> {
    return this._httpClient.get<IResponseOf<Note[]>>(`${this.API_URL_Note}/GetNotes/${projectID}`);
  }

  editNote(
    noteId: number,
    data: { note: string; isFav: boolean; isCompleted: boolean }
  ): Observable<any> {
    return this._httpClient.post(`${this.API_URL_Note}/EditNote/${noteId}`, data);
  }

addNote(
  projectId: string,
  data: { note: string; isFav: boolean; isCompleted: boolean }
): Observable<any> {
  return this._httpClient.post(`${this.API_URL_Note}/AddNote/${projectId}`, data);
}

}
