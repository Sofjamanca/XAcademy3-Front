import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatInputModule } from '@angular/material/input';
import { Course } from '../../core/models/course.model';
import { CardComponent } from '../../shared/components/card/card.component';

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
  cursos: Course[] = [];

  constructor( private router: Router, private apiService: ApiService){}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userName');
    }
    this.isStudent = this.apiService.isStudent();
  }

  isCollapsed = false;
  
  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
  }
}
