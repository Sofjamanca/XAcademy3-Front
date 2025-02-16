import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateServiceService } from '../services/state/auth-state-service.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthStateServiceService);
  const router = inject(Router);
  
  return authService.isAuthenticated$.pipe(
    map(isAuthenticated => {
      const isAdmin = localStorage.getItem('userRole') === 'admin';
      
      if (!isAuthenticated || !isAdmin) {
        router.navigate(['/login']);
        return false;
      }
      
      return true;
    })
  );
}; 