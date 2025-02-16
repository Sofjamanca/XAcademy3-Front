import { HttpInterceptorFn } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Por ahora, pasamos la petición sin modificar
  return next(req);

  /* Código comentado para usar más tarde cuando implementemos autenticación
  const usuariosService = inject(ApiService);
  const token = usuariosService.getAuthToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((err) => {
      return usuariosService.refreshToken().pipe(
        switchMap((res) => {
          const token = res.accessToken;
          localStorage.setItem('token', token);
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next(newReq);
        }),
        catchError((refreshErr) => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return throwError(() => refreshErr);
        })
      )
    })
  );
  */
};
