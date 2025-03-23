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
import { Teacher } from '../../../../core/models/teacher.model';
import { forkJoin } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

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
  ],
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.css'],
})
export class TeachersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'courses', 'actions'];
  teachers: Teacher[] = [];
  teachersMap: Map<number, string> = new Map();
  loading: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private teacherService: TeacherService, private router: Router) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.loading = true;

    this.teacherService.getTeachers().subscribe(
      (teachers) => {
        this.teachers = teachers;
        this.teachers.forEach((teacher) => {
          this.teachersMap.set(teacher.id, teacher.user.name);
        });
        this.loading = false;
      },
      (error) => {
        console.error('Error loading teachers:', error);
        this.loading = false;
      }
    );
  }

  deleteTeacher(teacher: Teacher) {
    this.teacherService.deleteTeacher(teacher.id).subscribe(() => {
      this.loadTeachers();
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
