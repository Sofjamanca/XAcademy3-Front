import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceHelper {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isMobileDevice(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe({
        next: (res) => {
          resolve(res.matches);  
        },
        error: () => reject(false),
      });
    });
  }

  
  watchDeviceChange(callback: (isMobile: boolean) => void): void {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe({
      next: (res) => {
        callback(res.matches);
      }
    });
  }
}
