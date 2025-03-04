import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { CoursesService } from '../../../../services/courses/courses.service';
import { Course } from '../../../../core/models/course.model';
import { Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../../../services/teacher/teacher.service';
import { Teacher } from '../../../../core/models/teacher.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'admin-teachers-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule
  ],
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.css']
})
export class TeachersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'courses', 'actions'];
  teachers: Teacher[] = [];
  teachersMap: Map<number, string> = new Map();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private teacherService: TeacherService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe((teachers) => {
      this.teachers = teachers;
      this.teachers.forEach((teacher) => {
        this.teachersMap.set(teacher.id, teacher.user.name);
      });
    });
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
    return teacher.courses.map((course) => course.title).join(', ');
  }
  
}
