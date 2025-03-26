import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoursesService } from '../../../../services/courses/courses.service';
import { Course } from '../../../../core/models/course.model';
import { Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../../../services/teacher/teacher.service';
import { Teacher, TeacherResponse } from '../../../../core/models/teacher.model';
import { forkJoin } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'admin-teachers-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    PaginationComponent,
  ],
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.css'],
})
export class TeachersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'specialty', 'email', 'actions'];
  teachers: Teacher[] = [];
  teachersMap: Map<number, string> = new Map();
  loading: boolean = true;
  teachersResponse: TeacherResponse | null = null;

  // Propiedades para paginación
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  // Propiedades para ordenamiento
  sortColumn: string = '';
  sortDirection: string = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private teacherService: TeacherService, private router: Router) {}

  ngOnInit() {
    this.loadOrderedTeachers();
  }

  loadOrderedTeachers() {
    this.loading = true;

    this.teacherService.getOrderedTeachers(
      this.sortColumn,
      this.sortDirection,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.teachers = response.teachers;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ordered teachers:', error);
        this.loading = false;
      }
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
    
    // Cargar los profesores ordenados
    this.loadOrderedTeachers();
  }

  // Método para manejar cambios de página
  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadOrderedTeachers();
  }

  // Método para determinar si una columna es ordenable
  isColumnSortable(column: string): boolean {
    // Lista de columnas que pueden ordenarse
    const sortableColumns = ['id', 'name', 'email'];
    return sortableColumns.includes(column);
  }

  deleteTeacher(teacher: Teacher) {
    this.teacherService.deleteTeacher(teacher.id).subscribe(() => {
      this.loadOrderedTeachers();
    });
  }

  editTeacher(teacher: Teacher) {
    this.router.navigate(['/admin/profesores/editar', teacher.id]);
  }

  getTeacherCourses(teacher: Teacher) {
    if (!teacher.courses || teacher.courses.length === 0) {
      return 'Ningún curso asignado';
    }
    
    if (teacher.courses.length === 1) {
      return teacher.courses[0].title;
    }
    
    // Si hay más de un curso, mostrar el primero + indicador de más
    return `${teacher.courses[0].title} + ${teacher.courses.length - 1} más`;
  }
  
  getCursosTooltip(teacher: Teacher): string {
    if (!teacher.courses || teacher.courses.length <= 1) {
      return '';
    }
    
    return teacher.courses.map(course => course.title).join(', ');
  }
}
