import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthStateServiceService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() { 
    this.checkAuthState();
  }

  public checkAuthState(): void {
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
