import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3001/api/auth'

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
}
