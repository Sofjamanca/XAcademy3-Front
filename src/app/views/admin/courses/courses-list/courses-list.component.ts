import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
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
    // Cargar cursos y profesores en paralelo
    forkJoin({
      courses: this.coursesService.getCourses(),
      teachers: this.teacherService.getTeachers(),
    }).subscribe({
      next: (data) => {
        this.courses = data.courses;
        this.teachers = data.teachers;

        this.teachers.forEach((teacher) => {
          if (teacher.user && teacher.id) {
            this.teachersMap.set(teacher.id, teacher.user.name);
          }
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.loading = false;
      },
    });
  }

  createCourse() {
    this.router.navigate(['/admin/cursos/crear']);
  }

  viewCourse(course: Course) {
    this.router.navigate(['/admin/cursos/ver', course.id]);
  }

  editCourse(course: Course) {
    this.router.navigate(['/admin/cursos/editar', course.id]);
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
        },
      });
    }
  }
}
