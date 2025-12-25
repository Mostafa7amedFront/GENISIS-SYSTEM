import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 333) {
       
        router.navigate(['/login']);
        return throwError(() => error);
      }

      if (error.status === 401) {
      } else if (error.status === 403) {
      } else if (error.status === 404) {
      } else if (error.status >= 500) {
      } else if (error.status === 0) {
      }

      return throwError(() => error);
    })
  );
};
