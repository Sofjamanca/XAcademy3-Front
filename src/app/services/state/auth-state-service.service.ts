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

  private userNameSubject: BehaviorSubject<string | null>; // Nueva propiedad
  userName$: Observable<string | null>; // Nueva propiedad observable

  constructor(
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // Inicializar userName con el valor del localStorage si está disponible
    this.userNameSubject = new BehaviorSubject<string | null>(this.localStorageService.getItem('name'));
    this.userName$ = this.userNameSubject.asObservable();

  }

  setAuthState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  setUserName(name: string | null): void { // Nuevo método
    console.log('AuthStateServiceService: setUserName llamado', name);
    this.userNameSubject.next(name);
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

