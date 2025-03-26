import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CoursesService } from '../../../../services/courses/courses.service';
import { Course } from '../../../../core/models/course.model';
import { Router } from '@angular/router';
import { TeacherService } from '../../../../services/teacher/teacher.service';
import { Teacher } from '../../../../core/models/teacher.model';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateCourseComponent } from '../../../../shared/components/create-course/create-course.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'admin-courses-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgxSkeletonLoaderModule,
    PaginationComponent
  ],
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css'],
})
export class CoursesListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'title',
    'quota',
    'teacher',
    'endDate',
    'status',
    'actions',
  ];
  courses: Course[] = [];
  teachers: Teacher[] = [];
  teachersMap: Map<number, string> = new Map();
  loading: boolean = true;
  
  // Propiedades para paginación
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  
  // Propiedades para ordenamiento
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private teacherService: TeacherService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Cargar solo los profesores
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
        
        // Construir mapa de profesores para referencias rápidas
        this.teachers.forEach((teacher) => {
          if (teacher.user && teacher.id) {
            this.teachersMap.set(teacher.id, teacher.user.name);
          }
        });
        
        // Cargar cursos con ordenamiento
        this.loadOrderedCourses();
      },
      error: (error) => {
        console.error('Error cargando profesores:', error);
        this.loading = false;
        this.showErrorMessage('Error cargando datos de profesores');
      },
    });
  }
  
  loadOrderedCourses() {
    this.loading = true;
    
    this.coursesService.getOrderedCourses(
      this.sortColumn,
      this.sortDirection,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.courses = response.courses || [];
        this.totalItems = response.totalItems || 0;
        this.totalPages = response.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando cursos ordenados:', error);
        this.loading = false;
        this.showErrorMessage('Error cargando datos de cursos');
      },
    });
  }
  
  // Método para manejar el ordenamiento cuando se hace clic en una columna
  sortData(column: string) {
    // Si ya estamos ordenando por esta columna, cambiar dirección
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es una columna nueva, establecer como columna activa
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    // Resetear a la primera página
    this.currentPage = 1;
    
    // Cargar datos con el nuevo ordenamiento
    this.loadOrderedCourses();
  }
  
  // Método para manejar cambios de página
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadOrderedCourses();
  }

  createCourse() {
    this.router.navigate(['/admin/cursos/crear']);
  }

  viewCourse(course: Course) {
    this.router.navigate(['/admin/cursos/ver', course.id]);
  }

  editCourse(course: Course) {
    this.router.navigate(['/admin/cursos/editar/', course.id]);
  }

  deleteCourse(course: Course) {
    console.log('Eliminar curso:', course);
  }

  getStatus(course: Course): string {
    return course.status === 'active' ? 'Activo' : 'Inactivo';
  }

  getTeacherName(course: Course): string {
    if (!course.teacher_id) return 'Sin profesor asignado';
    return this.teachersMap.get(course.teacher_id) || 'Profesor no encontrado';
  }

  getEndDate(course: Course): string {
    if (!course.endDate) return 'Sin fecha de finalización';

    const date = new Date(course.endDate);
    return date.toISOString().split('T')[0].split('-').reverse().join('/');
  }

  toggleStatus(course: Course) {
    const newStatus = !course.isActive;
    if (course.id) {
      this.coursesService.enableDisableCourse(course.id, newStatus).subscribe({
        next: () => {
          this.snackBar.open('Estado del curso actualizado', 'Cerrar', {
            duration: 3000,
            panelClass: 'success-snackbar',
          });
          course.isActive = newStatus;
        },
        error: (error) => {
          console.error('Error al cambiar el estado del curso:', error);
          this.showErrorMessage('Error al cambiar el estado del curso');
        },
      });
    }
  }
  
  // Método para mostrar mensajes de error
  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: 'error-snackbar',
    });
  }
  
  // Método para determinar si una columna es ordenable
  isColumnSortable(column: string): boolean {
    // Lista de columnas que pueden ordenarse
    const sortableColumns = ['id', 'title', 'quota', 'teacher', 'endDate', 'status'];
    return sortableColumns.includes(column);
  }
  
  // Método para obtener el nombre del campo de ordenamiento del backend
  getColumnSortField(column: string): string {
    // Mapeo de columnas de la UI a campos del backend
    const columnMap: { [key: string]: string } = {
      'id': 'id',
      'title': 'title',
      'quota': 'quota',
      'teacher': 'teacher', // Este se maneja especialmente en el backend
      'endDate': 'endDate',
      'status': 'isActive'
    };
    
    return columnMap[column] || column;
  }
}
