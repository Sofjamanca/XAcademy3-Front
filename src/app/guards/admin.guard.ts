import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateServiceService } from '../services/state/auth-state-service.service';
import { map } from 'rxjs';
import { LocalStorageService } from '../services/localstorage/local-storage.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthStateServiceService);
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  
  return authService.isAuthenticated$.pipe(
    map(isAuthenticated => {
      const isAdmin = localStorageService.getItem('userRole') === 'admin';
      
      if (!isAuthenticated || !isAdmin) {
        router.navigate(['/login']);
        return false;
      }
      
      return true;
    })
  );
}; 