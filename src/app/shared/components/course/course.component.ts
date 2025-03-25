import { Component, OnInit, ChangeDetectorRef, COMPILER_OPTIONS } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher/teacher.service';
import { ApiService } from '../../../services/api.service';
import { StudentService } from '../../../services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Class } from '../../../core/models/class.model';
import { ClassService } from '../../../services/class/class.service';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [MaterialModule, CommonModule, NgxSkeletonLoaderModule, MatExpansionModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  courseDetails!: Course;
  course: any;
  courseId: string = '';
  isQuotaZero: boolean = false;
  isLowQuota: boolean = false;
  inscriptionCount: number = 0;
  loading: boolean = true;
  classes: Class[] = [];
  expandedClassId: number | null = null;

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private classService: ClassService
  ) {}

  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(id);
    } else {
      console.error('No se ha encontrado el ID del curso.');
      this.loading = false;
    }
  }

  loadCourse(id: string) {
    const courseId = +id;
    if (!isNaN(courseId)) {
      this.coursesService.getCourseById(+id).subscribe({
        next: (data) => {
          this.course = data;
          if (this.course.quota === 0) {
            this.isQuotaZero = true;
          } else if (this.course.quota <= 5) {
            this.isLowQuota = true;
          }

          this.studentService.getInscriptionsByCourse(courseId).subscribe({
            next: (inscriptions) => {
              this.inscriptionCount = inscriptions.length;
              this.cdr.detectChanges();
            },
            error: (err) =>
              console.error('Error obteniendo las inscripciones:', err),
          });

          if (this.course.teacher_id) {
            this.teacherService
              .getTeacherById(this.course.teacher_id)
              .subscribe({
                next: (teacher) => {
                  this.course.teacherName = teacher.user?.name || 'Desconocido';
                  this.cdr.detectChanges();
                },
                error: (err) =>
                  console.error('Error obteniendo el profesor:', err),
              });
          }
          if (this.course.category_id) {
            this.coursesService
              .getCategoryById(this.course.category_id)
              .subscribe({
                next: (category) => {
                  if (category) {
                    this.course.categoryTitle = category.title;
                  }
                  this.cdr.detectChanges();
                },
                error: (err) =>
                  console.error('Error obteniendo la categoría:', err),
              });
          }
          this.loadClasses(courseId);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error obteniendo el curso:', err);
          this.loading = false;
        },
      });
    }
  }

  loadClasses(courseId: number) {
    this.classService.getClassesByCourseId(courseId).subscribe({
      next: (response: any) => {
        this.classes = response.clases || response;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error obteniendo las clases:', err);
      }
    });
  }

  toggleClassExpansion(classId: number) {
    this.expandedClassId = this.expandedClassId === classId ? null : classId;
  }

  getClassDate(classItem: Class): string {
    return new Date(classItem.class_date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goCourses() {
    this.router.navigate(['/courses']);
  }

  inscribirse() {
    if (this.course?.id) {
      this.router.navigate(['/inscribir', this.course.id]);
    }
  }

  verificarInscripcion() {
    if (!this.apiService.isAuthenticated()) {
      this.snackBar
        .open(
          'Debes iniciar sesión para inscribirte en un curso.',
          'Iniciar sesión',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        )
        .onAction()
        .subscribe(() => {
          this.router.navigate(['auth/login']);
        });
    } else {
      this.inscribirse();
    }
  }
}
