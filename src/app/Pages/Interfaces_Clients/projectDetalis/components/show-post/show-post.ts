import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../../../Core/service/post.service';
import { CommonModule } from '@angular/common';
import { Post } from '../../../../../Core/Interface/ipost';
import { MonthDayPipe } from '../../../../../Shared/pipes/month-day-pipe';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-show-post',
  imports: [CommonModule , MonthDayPipe ],
  templateUrl: './show-post.html',
  styleUrl: './show-post.scss'
})
export class ShowPost {
  id!: string;
  posts = signal<Post>({} as Post);
  baseurl = environment.baseimageUrl

  constructor(private http: HttpClient, private route: ActivatedRoute, private _post: PostService) { }

   ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.id = projectId;
        this.getOnePost(this.id);
      }
    });
  }

  getOnePost(postId: string) {
this._post.getProjectOnePost(postId).subscribe({
  next: (res) => {
    this.posts.set(res.value);
  },
  error: (err) => {

  }
});
  }


downloadFile(fileName: any) {
  const fileUrl = this.baseurl + fileName;

  fetch(fileUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch(err => console.error('Error downloading file:', err));
}

}