import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { TeacherService } from '../../../../services/teacher/teacher.service';
import { Teacher } from '../../../../core/models/teacher.model';
import { Course } from '../../../../core/models/course.model';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-teacher-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    CardComponent
  ],
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css']
})
export class TeacherDetailComponent implements OnInit {
  teacherId: number = 0;
  teacher?: Teacher;
  courses: Course[] = [];
  isLoading: boolean = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.teacherId = +id;
        this.loadTeacherDetails();
      } else {
        this.error = 'ID de profesor no válido';
        this.isLoading = false;
      }
    });
  }

  loadTeacherDetails(): void {
    this.isLoading = true;
    this.teacherService.getTeacherById(this.teacherId).subscribe({
      next: (response: any) => {
        this.teacher = response.teacher;
        this.courses = response.courses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos del profesor: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/profesores']);
  }

  editTeacher(): void {
    this.router.navigate(['/admin/profesores/editar', this.teacherId]);
  }

  goToCourse(courseId: number): void {
    if (courseId) {
      this.router.navigate(['/admin/cursos', courseId]);
    }
  }

  getModalidadClass(modalidad: string): string {
    if (!modalidad) {
      return '';
    }
    
    switch (modalidad) {
      case 'VIRTUAL':
        return 'virtual-chip';
      case 'PRESENCIAL':
        return 'presencial-chip';
      case 'HÍBRIDO':
        return 'hibrido-chip';
      default:
        return '';
    }
  }
} 