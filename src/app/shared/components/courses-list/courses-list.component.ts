import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { Category, Course } from '../../../core/models/course.model';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-courses-list',
  standalone: true,
  imports: [RouterModule,CardComponent, CommonModule, MaterialModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css'
})

export class CoursesListComponent implements OnInit {
  @Input() courses: Course[] = [];
  categories: Category[] = [];
  btnContent: string = 'Ver curso';
  selectedCourseId: number | null = null;
  constructor(private coursesSvc: CoursesService, private router:Router) { }

  ngOnInit() {
    // Si no se proporcionan cursos como entrada, cargarlos desde el servicio
    if (this.courses.length === 0) {
      this.coursesSvc.getCourses().subscribe(courses => {
        this.courses = courses;
      });
    }

    this.coursesSvc.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log(categories);
    })
  }

  getCategoryTitle(category_id: number): string {
    return this.categories.find(cat => cat.id === category_id)?.title || 'Sin categoría';
  }

  goToCourse(courseId?: number) {
    if (!courseId) {
      console.error("El ID del curso es inválido:", courseId);
      return;
    }
    console.log("🔹 Navegando a /course/", courseId);
    this.router.navigate(['/course', courseId]);
  }
}
