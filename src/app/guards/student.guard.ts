import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "../services/localstorage/local-storage.service";
import { AuthStateServiceService } from "../services/state/auth-state-service.service";
import { map, take } from "rxjs";

export const studentGuard = ()=>{
      const router = inject(Router);
      const localStorageService = inject(LocalStorageService);
      const authService = inject(AuthStateServiceService);  
      const role = localStorageService.getItem('role');
    
      return authService.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => {
            if (isAuthenticated && role === 'STUDENT') {
                return true;
            } else {
              router.navigate(['/Home']);
                return false;
            }
        })
      );

}