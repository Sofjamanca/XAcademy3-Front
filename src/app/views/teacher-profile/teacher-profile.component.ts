import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { LocalStorageService } from '../../services/localstorage/local-storage.service';
import { TeacherService } from '../../services/teacher/teacher.service';
import { Teacher } from '../../core/models/teacher.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthStateServiceService } from "../../services/state/auth-state-service.service";
import { Course } from '../../core/models/course.model';
import { CardComponent } from '../../shared/components/card/card.component';

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

    constructor(
        private localStorageService: LocalStorageService,
        private teacherService: TeacherService,
        private authStateService: AuthStateServiceService,
        private router: Router
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
        // Reiniciar el estado
        this.teacher = null;
        this.courses = [];
        this.error = null;
        this.loading = true;
        
        // Verificar si el usuario tiene rol de profesor
        const role = this.localStorageService.getItem('role');
        
        console.log('Rol del usuario:', role); // Para depuración
        
        // Comprobar si el rol es exactamente 'TEACHER' o puede ser otro formato
        if (role && (role === 'TEACHER' || role.toUpperCase() === 'TEACHER')) {
            // Obtener el ID del usuario del token JWT
            const token = this.localStorageService.getItem('token');
            if (token) {
                try {
                    // Decodificar el token para obtener el payload
                    const tokenParts = token.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        if (payload && payload.id) {
                            this.userId = payload.id;
                            console.log('ID del usuario extraído del token:', this.userId);
                            this.loadTeacherProfile();
                            return;
                        }
                    }
                    throw new Error('Formato de token inválido');
                } catch (e) {
                    console.error('Error al decodificar el token:', e);
                    this.teacher = null; // Asegurar que teacher es nulo cuando hay un error
                    this.error = 'Error al verificar la identidad del profesor';
                    this.loading = false;
                }
            } else {
                this.teacher = null; // Asegurar que teacher es nulo cuando hay un error
                this.error = 'No se encontró un token de autenticación';
                this.loading = false;
            }
        } else {
            console.error('Rol no válido para acceder a esta página:', role);
            this.teacher = null; // Asegurar que teacher es nulo cuando hay un error
            this.error = 'No tienes permisos de profesor para acceder a esta página';
            this.loading = false;
        }
    }

    loadTeacherProfile(): void {
        if (this.userId) {
            this.loading = true;
            this.teacherService.getTeacherByUserId(this.userId).subscribe({
                next: (response: any) => {
                    console.log('Respuesta completa del servidor:', response);
                    
                    // Extraer el objeto teacher del response
                    if (response && response.teacher) {
                        this.teacher = response.teacher;
                        console.log('Perfil de profesor extraído:', this.teacher);
                        
                        // Logs detallados para depurar - usando operador condicional para evitar errores
                        const hasCoursesProp = this.teacher ? this.teacher.hasOwnProperty('courses') : false;
                        console.log('¿Tiene propiedad courses?', hasCoursesProp);
                        
                        const courseType = this.teacher && this.teacher.courses ? typeof this.teacher.courses : 'no existe';
                        console.log('Tipo de la propiedad courses:', courseType);
                        
                        const coursesValue = this.teacher && this.teacher.courses ? JSON.stringify(this.teacher.courses, null, 2) : 'null';
                        console.log('Valor exacto de courses:', coursesValue);
                        
                        // Extraer los cursos directamente de la respuesta, no del profesor
                        if (response.courses && Array.isArray(response.courses)) {
                            this.courses = response.courses;
                            console.log('Cursos extraídos de response.courses:', this.courses);
                            console.log('Número de cursos:', this.courses.length);
                        } else {
                            console.log('No hay cursos en la respuesta o no tienen el formato esperado');
                            this.courses = [];
                        }
                        
                        this.error = null; // Limpiar cualquier error previo
                    } else {
                        console.error('La respuesta no tiene la estructura esperada o no se encontró el profesor:', response);
                        this.teacher = null;
                        this.courses = [];
                        this.error = 'No se encontró la información del profesor. Por favor, contacta con el administrador.';
                    }
                    
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error al cargar el perfil del profesor:', error);
                    this.teacher = null;
                    this.courses = [];
                    this.error = 'Error al cargar el perfil del profesor. Por favor, intenta nuevamente.';
                    this.loading = false;
                }
            });
        }
    }
}
