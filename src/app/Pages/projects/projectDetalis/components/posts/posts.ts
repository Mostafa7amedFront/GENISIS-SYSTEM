import { Component, effect, signal } from '@angular/core';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../../../Core/service/post.service';
import { environment } from '../../../../../../environments/environment';
import { Post } from '../../../../../Core/Interface/ipost';


@Component({
  selector: 'app-posts',
  imports: [ReactiveModeuls],
  templateUrl: './posts.html',
  styleUrls: ['./posts.scss']
})
export class Posts {
  id!: string;
  baseurl = environment.baseimageUrl
  posts = signal<Post[]>([]);
  currentIndex = signal(0);
  currentDate = new Date();
  currentMonth = signal(this.currentDate.getMonth());
  currentYear = signal(this.currentDate.getFullYear());
    pageNumber = 1;
totalPages = 1;

  monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL",
    "MAY", "JUNE", "JULY", "AUGUST",
    "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  constructor(private router: Router, private route: ActivatedRoute, private _post: PostService) {
    
      effect(() => {
      this._post.refreshPosts();
      this.loadPosts(this.id);
    }); 
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.id = projectId;
        this.loadPosts(projectId);
      }
    });

      this.updateBar();

  }

  goAddPost() {
    this.router.navigate([`/projectDetails/${this.id}/posts/add`]);
  }





nextPage() {
  if (this.pageNumber < this.totalPages) {
    this.pageNumber++;
    this.loadPosts(this.id);
  }
}
prevPage() {
  if (this.pageNumber > 1) {
    this.pageNumber--;
    this.loadPosts(this.id);
  }
}
  prevMonth() {
    this.currentMonth.update(m => (m + 11) % 12);
    if (this.id) this.loadPosts(this.id);
  }

  nextMonth() {
    this.currentMonth.update(m => (m + 1) % 12);
    if (this.id) this.loadPosts(this.id);
  }

  loadPosts(projectId: string) {
    const date = `${this.currentYear()}-${this.currentMonth() + 1}-01`;
    this._post.getProjectPosts(projectId,this.pageNumber, date).subscribe({
      next: (res) =>{ this.posts.set(res.value)
          this.totalPages = res.totalPages;
      },
      error: (err) => console.error('Error fetching posts', err)
    });
  }
  get displayPosts() {
    const filledPosts = [...this.posts()];
    while (filledPosts.length < 9) {
      filledPosts.push({
        id: 0,
        title: '',
        date: '',
        fileType: 0,
        caption: '',
        captionArabic: '',
        description: '',
        file: null
      });
    }
    return filledPosts;
  }

  progress = 0; // القيمة الحالية



increaseProgress(amount: number) {
  this.progress = Math.min(100, this.progress + amount); // مينفعش نعدي 100
  this.updateBar();
}

updateBar() {
  const bar = document.getElementById('loaderBar');
  const percentText = document.getElementById('percentValue');
  const glow = document.getElementById('barGlow');

  if (bar) bar.style.width = this.progress + '%';
  if (glow) glow.style.width = this.progress + '%';
  if (percentText) percentText.innerText = this.progress + '';
}
}
