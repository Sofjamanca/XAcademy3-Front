import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
      this.userNameSubject.next(this.localStorageService.getItem('userName')); // Usa 'userName'
  }

  setUserName(userName: string | null): void {
      this.userNameSubject.next(userName);
      if (userName) {
          this.localStorageService.setItem('userName', userName); // Usa 'userName'
      } else {
          this.localStorageService.removeItem('userName'); // Usa 'userName'
      }
  }
}
