import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveModeuls } from '../../../../Shared/Modules/ReactiveForms.module';
import { ServiceApi } from '../../../../Core/service/serviceapi';
import { IService } from '../../../../Core/Interface/iservice';
import { Clients } from '../../../../Core/service/clients';
import { SweetAlert } from '../../../../Core/service/sweet-alert';
import { IClients } from '../../../../Core/Interface/iclients';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-editclients',
  imports: [ReactiveModeuls],
  templateUrl: './editclients.html',
  styleUrl: './editclients.scss'
})
export class Editclients implements OnInit {
  createAccountForm: FormGroup;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;
  baseimageUrl = `${environment.baseimageUrl}`;

  private _serviceApi = inject(ServiceApi);
  private _clientAPi = inject(Clients);
  private _alert = inject(SweetAlert);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  clientTitles = ['Old Client', 'Long Term', 'New Client'];
  clientTitleMap: { [key: string]: number } = {
    'Old Client': 0,
    'Long Term': 1,
    'New Client': 2
  };
  selectedClientTitle: string | null = null;

  services = signal<IService[]>([]);
  selectedServices: string[] = [];

  clientId!: any;

  constructor(private fb: FormBuilder) {
    this.createAccountForm = this.fb.group({
      name: [''],
      title: [''],
      about: [''],
      location: [''],
      website: [''],
      email: [''],
      password: [''],
      username: [''],
      clientType: [0],
    });
  }

  ngOnInit(): void {
          const idParam = this._route.snapshot.paramMap.get('id');

    this.clientId = idParam;
    this.loadClientData();
    this.loadServices();
  }

  loadClientData() {
    this._clientAPi.getById(this.clientId).subscribe({
      next: (res) => {
        const client: IClients = res.value;
        this.createAccountForm.patchValue({
          name: client.name,
          title: client.title,
          about: client.about,
          location: client.location,
          website: client.websiteUrl,
          email: client.email,
          username: client.userName,
          clientType: client.clientType
        });

        this.imagePreview = client.imageUrl ? client.imageUrl : null;

        this.selectedClientTitle = Object.keys(this.clientTitleMap)
          .find(key => this.clientTitleMap[key] === client.clientType) || null;

        if (client.services && Array.isArray(client.services)) {
          this.selectedServices = client.services.map(s => s.id.toString());
        }
      },
      error: (err) => {
        this._alert.toast('Failed to load client data.', 'error');
      }
    });
  }

  /** 🔹 تحميل جميع الخدمات */
  loadServices() {
    this._serviceApi.getAll({}).subscribe({
      next: (res) => {
        this.services.set(res.value);
      },
      error: (err) => {
      }
    });
  }

  /** 🔹 عند اختيار صورة جديدة */
isFromApi = true; 
onImageChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;
    this.imagePreview = URL.createObjectURL(file);
    this.isFromApi = false;
  }
}
  selectClientTitle(title: string) {
    this.selectedClientTitle = this.selectedClientTitle === title ? null : title;
  }

  toggleService(serviceId: number) {
    const idString = serviceId.toString();
    if (this.selectedServices.includes(idString)) {
      this.selectedServices = this.selectedServices.filter(id => id !== idString);
    } else {
      this.selectedServices.push(idString);
    }
  }

  onSubmit() {
    const formData = new FormData();

    if (this.selectedImageFile) {
      formData.append('ImageFile', this.selectedImageFile, this.selectedImageFile.name);
    }

    formData.append('Name', this.createAccountForm.value.name);
    formData.append('Title', this.createAccountForm.value.title);
    formData.append('About', this.createAccountForm.value.about);
    formData.append('Location', this.createAccountForm.value.location);
    formData.append('WebsiteUrl', this.createAccountForm.value.website);
    formData.append('ClientType', this.clientTitleMap[this.selectedClientTitle!]?.toString() || '0');
    formData.append('Email', this.createAccountForm.value.email);
    formData.append('Password', this.createAccountForm.value.password || '');
    formData.append('UserName', this.createAccountForm.value.username);

    this.selectedServices.forEach(serviceId => {
      formData.append('Services', serviceId);
    });

    this._clientAPi.update(this.clientId, formData).subscribe({
      next: (res) => {
        this._alert.toast('Client updated successfully!', 'success');
        this._router.navigate(['/clients']);
      },
      error: (err) => {
        this._alert.toast('Error updating client!', 'error');
      }
    });
  }
}
