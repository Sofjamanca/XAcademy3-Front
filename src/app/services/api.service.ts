import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, from, map, mergeMap, catchError, throwError, switchMap } from 'rxjs';
import { AuthStateServiceService } from './state/auth-state-service.service';
import { Auth, getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut } from '@angular/fire/auth';
import { LocalStorageService } from './localstorage/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3001/api/auth'; // Agregado el prefijo /api/auth
  private _auth = inject(Auth);

  constructor(private http: HttpClient,
    private authStateService: AuthStateServiceService,
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  //abstraigo la logica
  private storeUserSession(response: { token: string, refreshToken: string, role: string, name: string }) {
    this.localStorageService.setItem('token', response.token);
    this.localStorageService.setItem('refreshToken', response.refreshToken);
    this.localStorageService.setItem('name', response.name);
    this.localStorageService.setItem('role', response.role);
    this.authStateService.setAuthState(true);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{ message: string, user: { name: string, role: string }, accessToken: string, refreshToken: string }>(
      `${this.apiUrl}/login`,
      credentials
    ).pipe(
      tap((response: any) => {
        if (response.accessToken && response.refreshToken) {
          this.storeUserSession({
            token: response.accessToken,
            refreshToken: response.refreshToken,
            name: response.user.name,
            role: response.user.role,
          });
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.authStateService.setAuthState(false);
      this.authStateService.setUserName(null);
      this.localStorageService.removeItem('token');
      this.localStorageService.removeItem('refreshToken');
      this.localStorageService.removeItem('userName');
      this.localStorageService.removeItem('name');
      this.localStorageService.removeItem('role');
      this.localStorageService.removeItem('studentData');

      from(signOut(this._auth)).subscribe({
        next: () => {
          observer.next();
          observer.complete();
        },
        error: (error) => {
          console.error('Error al cerrar sesión en Firebase:', error);
          observer.error(error);
        }
      });
    });
  }


  register(name: string, lastname: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, lastname, email, password });
  }

  resetPassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, oldPassword, newPassword });
  }

  refreshToken(): Observable<any> {
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
    this.localStorageService.removeItem('name');
    this.localStorageService.removeItem('role');
    this.localStorageService.removeItem('studentData');
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
  isTeacher(): boolean {
    return this.localStorageService.getItem('role') === 'TEACHER';
  }

  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count`);
  }

  signInWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this._auth, provider)).pipe(
      switchMap((result) => {
        const user = result.user;
        return this.http.post<{ token: string, refreshToken: string, role: string, name: string }>(
          `${this.apiUrl}/login-social`,
          {
            email: user.email,
            name: user.displayName,
            uuid: user.uid,
          }
        );
      }),
      tap((response: any) => {
        if (response.accessToken && response.refreshToken) {
          this.storeUserSession({
            token: response.accessToken,
            refreshToken: response.refreshToken,
            name: response.user.name,
            role: response.user.role
          });
        }
      }),
      catchError(error => {
        console.error('Error en login social:', error);
        return throwError(() => new Error(error));
      })
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

  getMe(): Observable<any> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = this.localStorageService.getItem('token') || localStorage.getItem('token');
    }
    if (!token) {
      return throwError(() => new Error('Token no proporcionado'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      map(data => ({
        user_id: data.id,
        dni: data.dni,
        phone: data.phone,
        birthday: data.birthday,
        address: data.address
      })),
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
  }
  
  getMeEdit(): Observable<any> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = this.localStorageService.getItem('token') || localStorage.getItem('token');
    }
    if (!token) {
      return throwError(() => new Error('Token no proporcionado'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      map(data => ({
        user_id: data.id,
        name: data.name,
        lastname: data.lastname,
        dni: data.dni,
        phone: data.phone,
        birthday: data.birthday,
        address: data.address
      })),
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-profile`, userData);
  }

  }
