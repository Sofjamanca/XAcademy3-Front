import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private tokenSubject = new BehaviorSubject<string | null>(this.getItem('accessToken'));
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
  }

 // En localStorageService.ts
setItem(key: string, value: string): void {
  if (isPlatformBrowser(this.platformId)) {
      try {
          localStorage.setItem(key, value);
          if(key === 'token'){
              this.tokenSubject.next(value);
          }
      } catch (error) {
          console.error('Error setting item from localStorage', error);
      }
  }
}

getItem(key: string): string | null {
  if (isPlatformBrowser(this.platformId)) {
      try {
          const value = localStorage.getItem(key);
          return value;
      } catch (error) {
          console.error('Error getting item from localStorage', error);
          return null;
      }
  }
  return null;
}
  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(key);
        if(key === 'accessToken'){
          this.tokenSubject.next(null); //actualizo el observable
        }
      } catch (error) {
        console.error('Error removing item from localStorage', error);
      }
      
    }
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.clear();
        this.tokenSubject.next(null); //actualizo el observable
      } catch (error) {
        console.error('Error clearing localStorage', error);
      }
    }
  }
  
  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }
}
