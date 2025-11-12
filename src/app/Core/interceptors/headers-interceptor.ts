import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from '../service/login';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const token = loginService.getToken();
  const isAuthRequest = req.url.includes('/Auth');

  // ✅ أضف التوكن فقط في الطلبات العادية (مش login ولا refresh)
  const clonedReq = !isAuthRequest && token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        console.warn('Token expired - attempting refresh...');
        return loginService.refreshToken().pipe(
          switchMap((res: any) => {
            loginService.saveToken(
              res.value.token,
              res.value.refreshToken,
              res.value.username,
              res.value.id
            );
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.value.token}` }
            });
            return next(newReq);
          }),
          catchError((refreshError) => {
            console.error('Refresh failed - redirecting to login.');
            loginService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
