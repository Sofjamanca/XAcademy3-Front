import { HttpInterceptorFn } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const usuariosService = inject(ApiService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Si estamos en el servidor, pasamos la petición sin modificar
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Solo excluimos las rutas específicas de autenticación
  if (req.url.includes('/api/auth/login') || 
      req.url.includes('/api/auth/register') || 
      req.url.includes('/api/auth/login-social')) {
    return next(req);
  }

  const token = usuariosService.getAuthToken();
  console.log('Token actual:', token); // Agregamos log para debugging

  // Clonamos la petición y añadimos el token si existe
  const authReq = token ? 
    req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    }) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        console.log('Error 401 detectado, intentando refresh token');
        return usuariosService.refreshToken().pipe(
          switchMap((res) => {
            console.log('Respuesta refresh token:', res);
            if (res.token && res.refreshToken) {
              usuariosService.setTokens(res.token, res.refreshToken);

              const newReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${res.token}`)
              });
              return next(newReq);
            } else {
              throw new Error('No se recibieron los tokens nuevos');
            }
          }),
          catchError((refreshErr) => {
            console.warn('Error en refresh token:', refreshErr);
            usuariosService.clearTokens();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};