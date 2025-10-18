import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDecode, ILogin } from '../Interface/idecode';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { IResponseOf } from '../../Shared/Interface/iresonse';

@Injectable({
  providedIn: 'root'
})
export class LoginService  {
  private readonly TOKEN_KEY = 'auth_token';
    private readonly refreshToken = 'refresh_token';

  private readonly API_URL = `${environment.apiUrl}auth`; 
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<IResponseOf<ILogin>> {
    return this.http.post<IResponseOf<ILogin>>(`${this.API_URL}`, credentials);
  }

  saveToken(token: string , refresh:string , username :string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
     localStorage.setItem('user_name',username);

    localStorage.setItem(this.refreshToken, refresh);

  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshToken);
  }
  decodeToken(): IDecode | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<IDecode>(token);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  getUser(): any {
    const decoded = this.decodeToken();
    return decoded ? decoded : null;
  }

  isLoggedIn(): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return false;

    const expiry = decoded.exp * 1000;
    return Date.now() < expiry;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.refreshToken);

      this.router.navigate(['/login']);
  }
}
