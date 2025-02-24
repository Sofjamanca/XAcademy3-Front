import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { Router } from '@angular/router';

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
    private courseService: CoursesService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseService.getCourseById(+id).subscribe({
        next: (data) => {
          this.course = data;
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Error obteniendo el curso:', err),
      });
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
    };
