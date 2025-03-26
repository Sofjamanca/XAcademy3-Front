import { Component, EventEmitter, inject, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent implements OnInit{
  apiService = inject(ApiService);
  userService = inject(UserService)
  isAdminUser: boolean = false;
  isStudentUser: boolean = false;
  isTeacher: boolean = false;
  showStudentPanel: boolean = false;
  private studentIdSubscription: Subscription | null = null;
  @Output() onLogout = new EventEmitter<void>(); 
  
  constructor(private cdr: ChangeDetectorRef, private router: Router){}

  ngOnInit(): void {
    this.isAdminUser = this.apiService.isAdmin();
    this.isStudentUser =this.apiService.isStudent();
    this.isTeacher = this.apiService.isTeacher();
  
    this.userService.studentId$.subscribe((studentId) => {
      this.showStudentPanel = !!studentId;
    });
  }

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
  
        setTimeout(() => {
          window.location.reload();
        }, 300); 
      },
      error: (error) => {
        console.error('Error al cerrar sesión', error);
      }
    });
  }
  
  goToAdmin() {
    this.router.navigate(['/admin']);
  }
  goToTeacher() {
    this.router.navigate(['/profesor']);
  }

  goToStudent(){
    this.router.navigate(['/perfil']);
  }

  
}
