import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
   
  private baseUrl =` ${environment.apiUrl }Projects`;
  refreshPosts = signal(false);
  
  notifyRefresh() {
    this.refreshPosts.set(!this.refreshPosts());
  }
  constructor(private http: HttpClient) {}

  addProjectPost(
    projectId: string,
    title: string,
    Number: number,
    captionEng: string,
    captionAra: string,
    postingAt: string,
    file: File,
    Cover: File
  ): Observable<any> {

    // form-data
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Cover', Cover);

    // query params
    const params = new HttpParams()
      .set('Title', title)
      .set("Number", Number)
      .set('CaptionEng', captionEng)
      .set('CaptionAra', captionAra)
      .set('PostingAt', postingAt);

    return this.http.post(
      `${this.baseUrl}/AddProjectPost/${projectId}`,
      formData,
      { params }
    );
  }


  
  // ------------------------------
  // GET POSTS BY PROJECT
  // ------------------------------
getProjectPosts(projectId: string, PageNumber: number = 1, date: string = ''): Observable<any> {
  let params = new HttpParams().set('PageNumber', PageNumber);

  if (date) {
    params = params.set('date', date);
  }

  return this.http.get(`${this.baseUrl}/GetProjectPosts/${projectId}`, { params });
}

getProjectOnePost(postId: string): Observable<any> {
  let url = `${this.baseUrl}/GetOneProjectPost/${postId}`;
  return this.http.get<any>(url);
}


  // ------------------------------
  // DELETE POST
  // ------------------------------
  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteProjectPost/${postId}`);
  }

  updatePost(
    postId: string,
    title: string,
    captionEng: string,
    captionAra: string,
    postingAt: string,
    file?: File
  ): Observable<any> {

    const formData = new FormData();

    formData.append('title', title);
    formData.append('caption', captionEng);
    formData.append('captionArabic', captionAra);
    formData.append('postingAt', postingAt);

    if (file) {
      formData.append('file', file);
    }

    return this.http.put(`${this.baseUrl}/${postId}`, formData, {
      observe: 'response'
    });
  }
}
