import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CoursesService } from '../../../../services/courses/courses.service';
import { Course } from '../../../../core/models/course.model';
import { Router } from '@angular/router';

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
  displayedColumns: string[] = ['id', 'title', 'description', 'actions'];
  courses: Course[] = [];

  constructor(
    private coursesService: CoursesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe(
      courses => this.courses = courses
    );
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
} 