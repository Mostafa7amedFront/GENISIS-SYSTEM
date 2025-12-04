import { Component, AfterViewInit } from '@angular/core';
declare var OnlineWebFonts_Com: any;
declare var __Animations: any;
@Component({
  selector: 'app-post-selector',
  imports: [],
  templateUrl: './post-selector.html',
  styleUrl: './post-selector.scss'
})
export class PostSelector  implements AfterViewInit {
  anim: any;

ngAfterViewInit() {
  this.anim = OnlineWebFonts_Com({
    Id: '.my-anim',
    Data: __Animations['520251'],
    Status: (progress: any, id: any) => {
      console.log("Progress:", progress);
    }
  });

  // ⭐ NOW the element exists → Play works
  this.anim.Play();
}

  ngOnInit() {
     this.anim.Play();
  }

  play() { this.anim.Play(); }
  pause() { this.anim.Pause(); }
  resume() { this.anim.Resume(); }
  stop() { this.anim.Stop(); }
}
