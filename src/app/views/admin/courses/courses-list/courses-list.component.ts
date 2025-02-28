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

@Component({
  selector: 'admin-courses-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'quota', 'teacher', 'endDate', 'status', 'actions'];
  courses: Course[] = [];
  teachers: Teacher[] = [];
  teachersMap: Map<number, string> = new Map();

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Cargar cursos y profesores en paralelo
    forkJoin({
      courses: this.coursesService.getCourses(),
      teachers: this.teacherService.getTeachers()
    }).subscribe({
      next: (data) => {
        this.courses = data.courses;
        this.teachers = data.teachers;
        
        this.teachers.forEach(teacher => {
          if (teacher.user && teacher.id) {
            this.teachersMap.set(teacher.id, teacher.user.name);
          }
        });
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
      }
    });
  }

  createCourse() {
    this.router.navigate(['/admin/cursos/crear']);
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
    return course.endDate ? new Date(course.endDate).toLocaleDateString() : 'Sin fecha de finalización';
  }
} 