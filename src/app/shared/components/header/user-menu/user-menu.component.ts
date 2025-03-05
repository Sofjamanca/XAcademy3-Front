import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent implements OnInit{
  apiService = inject(ApiService);
  isAdminUser: boolean = false;
  isStudentUser: boolean = false;

  constructor(private router: Router){}

  ngOnInit(): void {
    this.isAdminUser = this.apiService.isAdmin();
    this.isStudentUser =this.apiService.isStudent();
  }

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada exitosamente.');
        this.router.navigate(['/home']);
  
        setTimeout(() => {
          window.location.reload();
        }, 300); // Luego recargar
      },
      error: (error) => {
        console.error('Error al cerrar sesión', error);
      }
    });
  }
  
  
  
  

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

}
