import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LocalStorageService } from '../localstorage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateServiceService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean | null>(null);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private localStorageService: LocalStorageService
  ) {
    this.localStorageService.getTokenObservable().subscribe(token => {
      this.isAuthenticatedSubject.next(!!token); // Actualiza con el estado real
    });
  }

  public checkAuthState(): void {
    const token = this.localStorageService.getItem('token');
    console.log('Token encontrado:', token);
    this.isAuthenticatedSubject.next(!!token);
  }

  setAuthState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}
