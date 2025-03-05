import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher/teacher.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  courseDetails!: Course;
  course: any; 
  courseId: string = ""; 

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router, private teacherService: TeacherService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.coursesService.getCourseById(+id).subscribe({
        next: (data) => {
          this.course = data;

          if (this.course.teacher_id) {
            this.teacherService.getTeacherById(this.course.teacher_id).subscribe({
              next: (teacher) => {
                this.course.teacherName = teacher.user?.name || 'Desconocido';
                this.cdr.detectChanges();
              },
              error: (err) => console.error('Error obteniendo el profesor:', err),
            });
          }
          if (this.course.category_id) {
            // Asegurarse de que category_id sea válido
            this.coursesService.getCategoryById(this.course.category_id).subscribe({
              next: (category) => {
                console.log('Categoría obtenida:', category);  // Verifica si llega correctamente la categoría
                if (category) {
                  this.course.categoryTitle = category.title;
                }
                this.cdr.detectChanges();
              },
              error: (err) => console.error('Error obteniendo la categoría:', err),
            });
          }
  
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error obteniendo el curso:', err),
      });
    }
  }
  
  goHome() {
    this.router.navigate(['/home']);
  }

  inscribirse() {
    if (this.course?.id) {
      this.router.navigate(['/inscribir', this.course.id]);
    }
  }

    };
