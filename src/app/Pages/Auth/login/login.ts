import { Component, signal } from '@angular/core';
import { LoginService } from '../../../Core/service/login';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { SweetAlert } from '../../../Core/service/sweet-alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveModeuls],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: any;
  isLoading = signal(false);

  constructor(private fb: FormBuilder, private loginService: LoginService, private aleart: SweetAlert, private _route: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
       this.isLoading.set(true);
      this.loginService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.aleart.toast('Logged in successfully', 'success');
          this.loginService.saveToken(res.value.token, res.value.refreshToken , res.value.username , res.value.id );
                localStorage.setItem('user_type', res.value.role || ''); 

                this.isLoading.set(false);
          this._route.navigate(['/home']);
        },
        error: (err) => {
          this.aleart.toast(err.error?.detail || 'Login failed. Please check your credentials.', 'error');
          this.isLoading.set(false);
        }
      });
    } else {
      this.aleart.toast('Please fill in all required fields before logging in.', 'error');
       this.isLoading.set(false);
    }
  }


}
