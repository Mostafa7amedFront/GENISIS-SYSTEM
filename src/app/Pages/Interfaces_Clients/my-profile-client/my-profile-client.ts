import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProflieService } from '../../../Core/service/Clients/proflie.service';
import { IClients } from '../../../Core/Interface/iclients';
import { OrdinalDatePipe } from '../../../Shared/pipes/ordinal-date-pipe';
import { Feedbackclient } from '../feedbackclient/feedbackclient';
import { ProjectClient } from "../project-client/project-client";

@Component({
  selector: 'app-my-profile-client',
  imports: [OrdinalDatePipe, Feedbackclient, ProjectClient],
  templateUrl: './my-profile-client.html',
  styleUrl: './my-profile-client.scss'
})
export class MyProfileClient {
  baseimageUrl = `${environment.baseimageUrl}`;

  private _client = inject(ProflieService);
  clientId!: any;
aboutclient = signal<IClients >({} as IClients);


  ngOnInit(): void {
    
      this.loadEmployeeData();

  }

  loadEmployeeData() {
    this._client.getMy().subscribe({
      next: (res) => {
        this.aboutclient.set(res.value)
        localStorage.setItem("Id_Clients", res.value.id.toString());

      },
      error: (err) => {
      }
    });
  }
}
