import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userNameSubject: BehaviorSubject<string | null>;
  userName$: Observable<string | null>;

  constructor(private localStorageService: LocalStorageService) {
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
}
