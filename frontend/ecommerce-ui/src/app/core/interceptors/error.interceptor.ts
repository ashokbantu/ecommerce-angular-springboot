import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.getAccessToken();
            const retried = newToken
              ? req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + newToken) })
              : req;
            return next(retried);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }

      if (error.status === 403) {
        router.navigate(['/unauthorized']);
        toastService.error('Access denied');
      } else if (error.status >= 400) {
        const message = error.error?.message || error.message || 'An error occurred';
        toastService.error(message);
      }

      return throwError(() => error);
    })
  );
};
