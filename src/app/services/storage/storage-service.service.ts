import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getItem(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  hasItem(key: string): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem(key) !== null;
    }
    return false;
  }

  clear(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }
}
