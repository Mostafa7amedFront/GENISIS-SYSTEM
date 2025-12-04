import { DownloadFileService } from './../../../../../Core/service/download-file.service';
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

  constructor(private http: HttpClient, private route: ActivatedRoute, private _post: PostService , private _downloadFile :DownloadFileService) { }

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
    console.log(res);
    this.posts.set(res.value);
    console.log(this.posts())
  },
  error: (err) => {
    console.log(err); 

  }
});
  }


downloadFile(fileUrl: any) {
  this._downloadFile.downloadFile(fileUrl).subscribe({
    next: (blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;

      // extract filename
      const fileName = fileUrl.split('/').pop() ?? 'downloaded_file';
      a.download = fileName;

      a.click();

      URL.revokeObjectURL(objectUrl);
    },
    error: (err) => {
      console.log("Download error:", err);
    }
  });
}


}