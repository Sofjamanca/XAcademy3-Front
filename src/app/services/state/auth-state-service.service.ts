import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthStateServiceService{

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    if (isPlatformBrowser(this.platformId)) { 
      this.checkAuthState();
    }
  }

  public checkAuthState(): void {
    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', token);
      this.isAuthenticatedSubject.next(!!token);
    }
  }

  setAuthState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
  
}
