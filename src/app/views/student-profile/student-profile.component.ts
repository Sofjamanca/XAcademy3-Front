import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatInputModule } from '@angular/material/input';
import { Course } from '../../core/models/course.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { DeviceHelper } from '../../core/models/helpers/device-helper';
import { EditProfileComponent } from '../../shared/components/edit-profile/edit-profile.component';
import { StudentService } from '../../services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../services/localstorage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [NgFor, NgIf, CardComponent, MaterialModule, CommonModule, RouterModule, MatInputModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})


export class StudentProfileComponent implements OnInit{
  userName: string | null = null;
  isStudent: boolean = false;
  isMobile: boolean = false;
  isCollapsed = false; 
  userId: number | null = null;
  studentId: number | null = null;

  constructor(private localStorageService: LocalStorageService, private studentService: StudentService, private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object, 
    private deviceHelper: DeviceHelper, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userName');
    }
    this.isStudent = this.apiService.isStudent();
    this.getUserData();
    this.deviceHelper.watchDeviceChange((isMobile: boolean) => {
      this.isMobile = isMobile;
      if (this.isMobile) {
        this.isCollapsed = true; 
      } else {
        this.isCollapsed = false; 
      }
    });
  }
  
  getUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.apiService.getMe().subscribe(
          (data: any) => {
            this.userId = data.user_id;
            if (this.userId) {
              this.getStudentIdByUserId(this.userId);
            }
          },
          (error) => {
            console.error('Error al obtener los datos del usuario:', error);
            this.snackBar.open('Error al obtener los datos del usuario', 'Cerrar', { duration: 3000 });
          }
        );
      } else {
        console.warn('Token no encontrado en localStorage'); 
      }
    } 
  }

  getStudentIdByUserId(userId: number): void {
    this.studentService.getStudentByUserId(userId).subscribe(
      (response: any) => {
        if (response && response.student && response.student.id) {
          this.studentId = response.student.id;
        } else {
          console.error('No se encontró el id en la respuesta');
        }
      },
      (error) => {
        console.error('Error al obtener el student_id:', error);
        this.snackBar.open('Error al obtener el ID del estudiante', 'Cerrar', { duration: 3000 });
      }
    );
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
