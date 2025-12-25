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
export class LoginService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly API_URL = `${environment.apiUrl}Auth`; // ✅ تأكد من الـ A كابيتال زي السيرفر
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  // تسجيل الدخول
  login(credentials: { email: string; password: string }): Observable<IResponseOf<ILogin>> {
    return this.http.post<IResponseOf<ILogin>>(`${this.API_URL}`, credentials);
  }

  // ✅ دالة لتجديد التوكن
  refreshToken(): Observable<IResponseOf<ILogin>> {
    const token = this.getToken();
    const refresh = this.getRefreshToken();
    return this.http.post<IResponseOf<ILogin>>(`${this.API_URL}/refresh`, { token, refreshToken: refresh });
  }

  // حفظ التوكنات
  saveToken(token: string, refresh: string, username: string, id: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_KEY, refresh);
    localStorage.setItem('user_name', username);
    localStorage.setItem('user_id', id);
  }

  // getters
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  // فك التوكن
  decodeToken(): IDecode | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<IDecode>(token);
    } catch (e) {
      return null;
    }
  }

  // بيانات المستخدم
  getUser(): any {
    return this.decodeToken();
  }

  // التحقق من تسجيل الدخول
  isLoggedIn(): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return false;
    const expiry = decoded.exp * 1000;
    return Date.now() < expiry;
  }

  // تسجيل الخروج
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
