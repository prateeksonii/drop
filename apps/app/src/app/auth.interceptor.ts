import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = localStorage.getItem('hop_token');

  const clonedRequest = req.clone({
    headers: token
      ? req.headers.set('Authorization', localStorage.getItem('hop_token')!)
      : undefined,
  });
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Attempt to refresh the token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request after refreshing the token
            const clonedRequest = req.clone({
              headers: req.headers.set(
                'Authorization',
                localStorage.getItem('hop_token')!
              ),
            });
            return next(clonedRequest);
          }),
          catchError((refreshError) => {
            // Handle refresh error
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
