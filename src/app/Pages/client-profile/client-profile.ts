import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FeedbackProfile } from '../projects/feedback-profile/feedback-profile';
import { ProjectsProfile } from '../projects/projects-profile/projects-profile';
import { environment } from '../../../environments/environment';
import { Clients } from '../../Core/service/clients';
import { ActivatedRoute } from '@angular/router';
import { IClients } from '../../Core/Interface/iclients';
import { FeedbackClient } from "./Components/feedback-client/feedback-client";


@Component({
  selector: 'app-client-profile',
  imports: [ProjectsProfile, FeedbackClient],
  templateUrl: './client-profile.html',
  styleUrl: './client-profile.scss'
})
export class ClientProfile {
  baseimageUrl = `${environment.baseimageUrl}`;

  private _client = inject(Clients);
  private _route = inject(ActivatedRoute);
  clientId!: any;
aboutclient = signal<IClients | null>(null);


  ngOnInit(): void {
      const idParam = this._route.snapshot.paramMap.get('id');

    this.clientId = idParam;
    if (this.clientId) {
      this.loadEmployeeData();
    }
  }

  loadEmployeeData() {
    this._client.getById(this.clientId).subscribe({
      next: (res) => {
        this.aboutclient.set(res.value)
      
      },
      error: (err) => {
      }
    });
  }

  
}
