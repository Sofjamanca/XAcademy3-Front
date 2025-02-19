import { HttpInterceptorFn } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const usuariosService = inject(ApiService);
  const router = inject(Router);

  const token = usuariosService.getAuthToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {//si expiro
        return usuariosService.refreshToken().pipe(
          switchMap((res) => {
            const token = res.accessToken;//se guarda el nuevo token
            usuariosService.setTokens(token, res.refreshToken);

            const newReq = req.clone({//intenta de nuevo la peticion con el token nuevo
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            return next(newReq);
          }),

          catchError((refreshErr) => {//si falla el refresh token
            console.warn('El refresh token ha expirado. Cerrando sesión...');
            usuariosService.clearTokens();
            router.navigate(['/login']).then(() => {
              window.location.reload(); // 🔄 Fuerza la recarga de la página
            });

            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};