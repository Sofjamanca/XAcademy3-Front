import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3001/api/auth'; // Agregado el prefijo /api/auth

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(name: string, lastname: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, lastname, email, password });
  }

  resetPassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, oldPassword, newPassword });
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);
    
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { headers });
  }

  getAuthToken(): string {
    return localStorage.getItem('token') || '';
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken') || '';
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}