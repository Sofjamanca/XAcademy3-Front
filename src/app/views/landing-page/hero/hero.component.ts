import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


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
    private router: Router
  ){}

  ngOnInit(): void {
    this.loadLatestCourses();
  }
  loadLatestCourses() {
      this.coursesServices.getLastestCourses().subscribe({
        next:(data)=>this.courses=data,
        error:(error)=>console.log(error)
      });
  }

  goToCourseDetail(courseId: number){
    this.router.navigate(['/courses', courseId]);
  }

  banner1: string = "assets/images/banner-1.png";
  banner2: string = "assets/images/banner-2.png";
  banner3: string = "assets/images/banner-3.png";

}
