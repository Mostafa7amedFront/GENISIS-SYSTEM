import { Component } from '@angular/core';
import { UploadFiles } from "./components/upload-files/upload-files";

@Component({
  selector: 'app-project-details',
  imports: [UploadFiles],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss'
})
export class ProjectDetails {

}
