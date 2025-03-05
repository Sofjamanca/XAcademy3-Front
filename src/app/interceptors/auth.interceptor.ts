import { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { catchError,  switchMap,  throwError } from "rxjs";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Si la aplicación está corriendo en el servidor, pasamos la petición sin modificar
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Excluir rutas de autenticación para que no se les agregue el token
  if (req.url.includes('/api/auth/login') || 
      req.url.includes('/api/auth/register') || 
      req.url.includes('/api/auth/login-social')) {
    return next(req);
  }

  const token = apiService.getAuthToken();

  // Clonar la petición y añadir el token si existe
  const authReq = token ? 
    req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    }) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        console.warn('⚠️ Error 401 detectado. Intentando refrescar token...');

        return apiService.refreshToken().pipe(
          switchMap((res) => {

            if (res.accesToken && res.refreshToken) {
              apiService.setTokens(res.accesToken, res.refreshToken);

              // Clonar la petición original con el nuevo token
              const newReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${res.accesToken}`)
              });

              return next(newReq); // Reenviar la petición con el nuevo token
            } else {
              throw new Error('No se recibieron nuevos tokens.');
            }
          }),
          catchError((refreshErr) => {
            console.error('❌ Error en el refresh token:', refreshErr);
            apiService.clearTokens(); // Limpiar tokens si falla
            router.navigate(['/login']); // Redirigir al login
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};