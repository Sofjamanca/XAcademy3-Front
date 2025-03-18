import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userNameSubject: BehaviorSubject<string | null>;
  userName$: Observable<string | null>;
  private baseUrl: string = 'http://localhost:3001/api/users';

  constructor(private localStorageService: LocalStorageService, private http: HttpClient) {
    const userName = this.localStorageService.getItem('userName');
    this.userNameSubject = new BehaviorSubject<string | null>(userName || null);
    this.userName$ = this.userNameSubject.asObservable();
  }

  setUserName(name: string | null): void {
    this.userNameSubject.next(name);
  }
  // user.service.ts
  clearUserName(): void {
    this.localStorageService.removeItem('userName');
    this.userNameSubject.next(null);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }
}
