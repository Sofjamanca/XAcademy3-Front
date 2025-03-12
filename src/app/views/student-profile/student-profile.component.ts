import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatInputModule } from '@angular/material/input';
import { Course } from '../../core/models/course.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { DeviceHelper } from '../../core/models/helpers/device-helper';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [NgFor, NgIf, CardComponent, MaterialModule, CommonModule, RouterModule, MatInputModule],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent implements OnInit{
  userName: string | null = null;
  isStudent: boolean = false;
  isMobile: boolean = false;
  isCollapsed = false; 

  constructor(private deviceHelper: DeviceHelper, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userName');
    }
    this.isStudent = this.apiService.isStudent();

    this.deviceHelper.watchDeviceChange((isMobile: boolean) => {
      this.isMobile = isMobile;
      if (this.isMobile) {
        this.isCollapsed = true; 
      } else {
        this.isCollapsed = false; 
      }
    });
  }
  
  toggleSidenav() {
    if (this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }
  

  closeSidenavOnMobile() {
    if (this.isMobile) {
      this.isCollapsed = true; 
    }
  }
}
