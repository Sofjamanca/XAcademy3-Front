import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateServiceService } from '../services/state/auth-state-service.service';
import { LocalStorageService } from '../services/localstorage/local-storage.service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const authService = inject(AuthStateServiceService);  
  const role = localStorageService.getItem('role');

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
        if (isAuthenticated && role === 'ADMIN') {
            return true;
        } else {
          router.navigate(['/Home']);
            return false;
        }
    })
  );
}; 