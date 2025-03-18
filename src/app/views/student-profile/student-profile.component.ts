import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditProfileComponent } from '../../shared/components/edit-profile/edit-profile.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent implements OnInit{
  userName: string | null = null;
  isCollapsed = false;
  isStudent: boolean = false;

  constructor( private router: Router, private apiService: ApiService){}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userName');
    }
    this.isStudent = this.apiService.isStudent();
  }

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
  }
}