import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { LocalStorageService } from '../../services/localstorage/local-storage.service';
import { TeacherService } from '../../services/teacher/teacher.service';
import { Teacher } from '../../core/models/teacher.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthStateServiceService } from "../../services/state/auth-state-service.service";
import { Category, Course } from '../../core/models/course.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { CoursesService } from '../../services/courses/courses.service';

@Component({
    selector: 'app-teacher-profile',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CardComponent
    ],
    templateUrl: './teacher-profile.component.html',
    styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {
    userId: number | null = null;
    teacher: Teacher | null = null;
    courses: Course[] = [];
    loading: boolean = true;
    error: string | null = null;
    isCollapsed = false;
    categories?: Category[];

    constructor(
        private localStorageService: LocalStorageService,
        private teacherService: TeacherService,
        private authStateService: AuthStateServiceService,
        private router: Router,
        private coursesSvc: CoursesService
    ) { }

    toggleSidenav() {
        this.isCollapsed = !this.isCollapsed;
    }

    editCourse(courseId: number): void {
        if (courseId) {
            this.router.navigate(['/course-management', courseId]);
        }
    }
    

    ngOnInit(): void {
        // verificar si el usuario tiene rol de profesor
        const role = this.localStorageService.getItem('role');
        
        if (role === 'TEACHER') {
            // obtener el id del usuario del token JWT
            const token = this.localStorageService.getItem('token');
            if (token) {
                try {
                    // decodificar el token para obtener el payload
                    const tokenParts = token.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        if (payload && payload.id) {
                            this.userId = payload.id;
                            this.loadTeacherProfile();
                            return;
                        }
                    }
                    throw new Error('Formato de token inválido');
                } catch (e) {
                    console.error('Error al decodificar el token:', e);
                    this.error = 'Error al verificar la identidad del profesor';
                    this.loading = false;
                }
            } else {
                this.loading = false;
                this.error = 'No se encontró un token de autenticación';
            }
        } else {
            this.loading = false;
            this.error = 'No tienes permisos de profesor para acceder a esta página';
        }
    }
    getCategoryTitle(category_id?: number): string {
        return (
          this.categories?.find((cat) => cat.id === category_id)?.title ||
          'Sin categoría'
        );
      }
    

    loadTeacherProfile(): void {
        if (this.userId) {
            this.loading = true;
            this.teacherService.getTeacherByUserId(this.userId).subscribe({
                next: (response: any) => {
                    
                    // extraer el objeto teacher del response
                    if (response && response.teacher) {
                        this.teacher = response.teacher;
                        this.coursesSvc.getCategories().subscribe((categories) => {
                            this.categories = categories;
                        });
                        // extraer los cursos directamente de la respuesta, no del profesor
                        if (response.courses && Array.isArray(response.courses)) {
                            this.courses = response.courses;
                        } else {
                            this.courses = [];
                        }
                    } else {
                        console.error('La respuesta no tiene la estructura esperada:', response);
                        this.error = 'Error: La respuesta del servidor no tiene el formato esperado';
                    }
                    
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error al cargar el perfil del profesor:', error);
                    this.error = 'Error al cargar el perfil del profesor. Por favor, intenta nuevamente.';
                    this.loading = false;
                }
            });
        }
    }
}
