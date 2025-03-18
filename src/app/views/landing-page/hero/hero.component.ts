import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'landing-page-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit{
  courses: any[]=[];

  constructor(
    private coursesServices:CoursesService,
    private router: Router,
    private sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
    this.loadLatestCourses();
  }
  loadLatestCourses() {
    this.coursesServices.getLastestCourses().subscribe({
      next: (data) => {
        // Process the courses to add sanitized image URLs
        this.courses = data.map(course => ({
          ...course,
          safe_image_url: this.sanitizer.bypassSecurityTrustUrl(course.image_url || ''),
        }));
      },
      error: (error) => console.log(error)
    });
  }

  goToCourseDetail(courseId: number, event?: Event) {
    if (event) {
      event.stopPropagation(); // Evita que el clic en el botón active el clic en la imagen
    }
    this.router.navigate(['/course', courseId]);
  }


}
