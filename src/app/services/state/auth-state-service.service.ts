import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStateServiceService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    console.log('AuthStateServiceService: Constructor llamado');
    console.log('AuthStateServiceService: Estado inicial', this.isAuthenticatedSubject.value);
  }

  setAuthState(isAuthenticated: boolean): void {
    console.log('AuthStateServiceService: setAuthState llamado', isAuthenticated);
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  private checkAuthentication(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.localStorageService.getItem('token');
      return !!token;
    } else {
      return false; // O un valor predeterminado para SSR
    }
  }
}
