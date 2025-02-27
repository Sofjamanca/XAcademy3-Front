import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, tap, from, map, mergeMap, catchError, throwError } from 'rxjs';
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
  ) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{ message: string, user: { name: string, role: string }, accessToken: string, refreshToken: string }>(
        `${this.apiUrl}/login`,
        credentials).pipe(
        tap((response: any) => {
            console.log('Respuesta login completa:', response);
            if (response.accessToken && response.refreshToken) {
                this.localStorageService.setItem('token', response.accessToken);
                console.log('Token almacenado directamente:', this.localStorageService.getItem('token'));
                // Introduce un pequeño retraso aquí
                setTimeout(() => {
                    console.log('Refresh Token almacenado:', this.localStorageService.getItem('refreshToken'));
                    this.localStorageService.setItem('name', response.user.name);
                    console.log('nombre:', this.localStorageService.getItem('name'));
                    this.localStorageService.setItem('role', response.user.role);
                    console.log('rol:', this.localStorageService.getItem('role'));
                    this.authStateService.setAuthState(true);
                }, 10); // 10 milisegundos de retraso
            }
        }),
        catchError(error => {
            console.error('Error en login:', error);
            return throwError(() => new Error(error));
        })
    );
}
logout(): Observable<any> {
  const refresh = this.getRefreshToken();
  if (!refresh) {
      console.error('No se encontró el refreshToken para el logout.');
      // Puedes lanzar un error o manejarlo de otra manera apropiada
      return throwError(() => new Error('No se encontró el refreshToken para el logout.'));
  }
  const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + refresh
  });
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

  getAuthToken(): string | null{
    return this.localStorageService.getItem('token'); 
  }

  getRefreshToken(): string | null{
    return this.localStorageService.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.localStorageService.setItem('token', accessToken);
    this.localStorageService.setItem('refreshToken', refreshToken);

  }

  clearTokens(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return this.localStorageService.getItem('token') !== null;
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
