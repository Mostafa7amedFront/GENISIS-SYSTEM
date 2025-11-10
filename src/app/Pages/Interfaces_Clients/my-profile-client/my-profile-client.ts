import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProflieService } from '../../../Core/service/Clients/proflie.service';
import { IClients } from '../../../Core/Interface/iclients';

@Component({
  selector: 'app-my-profile-client',
  imports: [],
  templateUrl: './my-profile-client.html',
  styleUrl: './my-profile-client.scss'
})
export class MyProfileClient {
  baseimageUrl = `${environment.baseimageUrl}`;

  private _client = inject(ProflieService);
  clientId!: any;
aboutclient = signal<IClients | null>(null);


  ngOnInit(): void {
      this.loadEmployeeData();

  }

  loadEmployeeData() {
    this._client.getMy().subscribe({
      next: (res) => {
        console.log(res.value)
        this.aboutclient.set(res.value)
        localStorage.setItem("Id_Clients", res.value.id.toString());

      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
