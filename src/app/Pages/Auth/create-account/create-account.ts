import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveModeuls],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss'
})
export class CreateAccount {
createAccountForm: FormGroup;
  imagePreview: string | null = null;

  // اختيارات Client Title
  clientTitles = ['Old Client', 'Long Term', 'New Client'];
  selectedClientTitle: string | null = null;

  // اختيارات Services
  services = [
    'Old Client',
    'Branding',
    'UI/UX',
    'Web Development',
    'Presentation Design',
    'Packaging Design',
  ];
  selectedServices: string[] = [];

  constructor(private fb: FormBuilder) {
    this.createAccountForm = this.fb.group({
      name: [''],
      title: [''],
      location: [''],
      website: [''],
      about: [''],
    });
  }

  // اختيار صورة
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // اختيار Client Title
  selectClientTitle(title: string) {
    this.selectedClientTitle = this.selectedClientTitle === title ? null : title;
  }

  // اختيار Services (Multiple)
  toggleService(service: string) {
    if (this.selectedServices.includes(service)) {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    } else {
      this.selectedServices.push(service);
    }
  }

  // Submit
  onSubmit() {
    const formData = {
      ...this.createAccountForm.value,
      clientTitle: this.selectedClientTitle,
      services: this.selectedServices,
      image: this.imagePreview,
    };
    alert('Form submitted! 🎉');
  }
}
