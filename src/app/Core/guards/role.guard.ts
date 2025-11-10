import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const _router = inject(Router);
    const _platform = inject(PLATFORM_ID);

    if (!isPlatformBrowser(_platform)) return false;

    const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('user_type');

    if (!token) {
      _router.navigate(['/login']);
      return false;
    }

    if (!role || !allowedRoles.includes(role.toLowerCase())) {
      switch (role?.toLowerCase()) {
        case 'admin':
          _router.navigate(['/']);
          break;
        case 'employee':
          _router.navigate(['/employee']);
          break;
        case 'client':
          _router.navigate(['/client']);
          break;
      
        default:
          _router.navigate(['/login']);
      }
      return false;
    }

    return true;
  };
};