import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveModeuls } from '../../../../Shared/Modules/ReactiveForms.module';
import { ServiceApi } from '../../../../Core/service/serviceapi';
import { IService } from '../../../../Core/Interface/iservice';
import { Clients } from '../../../../Core/service/clients';
import { SweetAlert } from '../../../../Core/service/sweet-alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addclients',
  imports: [ReactiveModeuls],
  templateUrl: './addclients.html',
  styleUrl: './addclients.scss'
})
export class Addclients implements OnInit {
  createAccountForm: FormGroup;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;
  private _serviceApi = inject(ServiceApi);
  private _clientAPi = inject(Clients);
private _alert = inject(SweetAlert); 
  private _router = inject(Router);

clientTitles = ['Old Client', 'Long Term', 'New Client'];
clientTitleMap: { [key: string]: number } = {
  'Old Client': 0,
  'Long Term': 1,
  'New Client': 2
};  selectedClientTitle: string | null = null;
  services = signal<IService[]>([]);
  selectedServices: string[] = [];

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
    this._serviceApi.getAll({}).subscribe({
      next: (res) => {
        this.services.set(res.value)

      },
      error: (err) => {
      }
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.imagePreview = URL.createObjectURL(file);
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
  if (!this.selectedImageFile) {
      this._alert.toast('Please fill all required fields and upload an image.' , 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('ImageFile', this.selectedImageFile, this.selectedImageFile.name);
  formData.append('Name', this.createAccountForm.value.name);
  formData.append('Title', this.createAccountForm.value.title);
  formData.append('About', this.createAccountForm.value.about);
  formData.append('Location', this.createAccountForm.value.location);
  formData.append('WebsiteUrl', this.createAccountForm.value.website);
  formData.append('ClientType', this.clientTitleMap[this.selectedClientTitle!].toString());
  formData.append('Email', this.createAccountForm.value.email);
  formData.append('Password', this.createAccountForm.value.password);
  formData.append('UserName', this.createAccountForm.value.username);

  this.selectedServices.forEach(serviceId => {
    formData.append('Services', serviceId);
  });
  
  this._clientAPi.add(formData).subscribe({
  
    next: (res) => {
            this._alert.toast('Client added successfully!' , 'success');
            this._router.navigate(['/clients'])
    },
    error: (err) => {
                  this._alert.toast('Error adding client!' , 'error');

    }
  });
}
}
