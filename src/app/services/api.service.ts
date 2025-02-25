import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, tap, from, map, mergeMap } from 'rxjs';
import { AuthStateServiceService } from './state/auth-state-service.service';
import { Auth, getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { LocalStorageService } from './localstorage/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3001/api/auth'; // Agregado el prefijo /api/auth
  private _auth = inject(Auth);

  constructor(private http: HttpClient,
    private authStateService: AuthStateServiceService,
    private localStorageService: LocalStorageService
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Respuesta login:', response);
        if (response.token && response.refreshToken) {
          this.setTokens(response.token, response.refreshToken);
          this.localStorageService.setItem('role', response.role);
          this.localStorageService.setItem('name', response.name);
          this.authStateService.setAuthState(true);
        }
      })
    );
  }
  logout(): Observable<any> {
    const refresh = this.getRefreshToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${refresh}`);
  
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        this.clearTokens();
        this.authStateService.setAuthState(false);
      })
    );
  }
  
  
  

  register(name: string, lastname: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, lastname, email, password });
  }

  resetPassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, oldPassword, newPassword });
  }

  refreshToken(): Observable<any> {
    console.log('refreshToken() llamado');
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {})
  }

  getAuthToken(): string {
    const token = this.localStorageService.getItem('token');
    console.log('getAuthToken:', token);
    return token || '';
  }

  getRefreshToken(): string {
    return this.localStorageService.getItem('refreshToken') || '';
  }

  setTokens(accessToken: string, refreshToken: string): void {
    console.log('setTokens - accessToken:', accessToken, 'refreshToken:', refreshToken);
    this.localStorageService.setItem('token', accessToken);
    this.localStorageService.setItem('refreshToken', refreshToken);
  
  }

  clearTokens(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('refreshToken');
    this.localStorageService.removeItem('name');
    this.localStorageService.removeItem('role');
  }

  isAuthenticated(): boolean {
    if(this.localStorageService.getItem('token') !== null){
      return true;
    }
    return false;
  }
  isAdmin(): boolean {
    return this.localStorageService.getItem('role') === 'ADMIN';
  }
  isStudent(): boolean {
    return this.localStorageService.getItem('role') === 'STUDENT';
  }

  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count`);
  }

  signInWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this._auth, provider)).pipe(
      map((result) => {
        const user = result.user;
        return this.http.post(`${this.apiUrl}/login-social`, {
          email: user.email,
          name: user.displayName,
          uuid: user.uid,
        }).pipe(
          tap((response: any) => {
            console.log('Respuesta login social:', response);
            if (response.token && response.refreshToken) {
              this.setTokens(response.token, response.refreshToken);
              this.localStorageService.setItem('role', response.role);
              this.localStorageService.setItem('name', response.name);
             
              this.authStateService.setAuthState(true);
            }
          })
        );
      }),
      mergeMap(obs => obs)
    );
  }

  signInWithFacebook(): Observable<any> {
    const provider = new FacebookAuthProvider();
    return from(signInWithPopup(this._auth, provider)).pipe(
      map((result) => {
        const user = result.user;
        return this.http.post(`${this.apiUrl}/login-social`, {
          email: user.email,
          name: user.displayName,
          uuid: user.uid,
        }).pipe(
          tap((response: any) => {
            console.log('Respuesta login social:', response);
            if (response.token && response.refreshToken) {
              this.setTokens(response.token, response.refreshToken);
              this.localStorageService.setItem('role', response.role);
              this.localStorageService.setItem('name', response.name);
             
              this.authStateService.setAuthState(true);
            }
          })
        );
      }),
      mergeMap(obs => obs)
    );
  }

}
