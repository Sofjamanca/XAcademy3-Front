import { Component } from '@angular/core';
import { CoursesListComponent } from '../../../shared/components/courses-list/courses-list.component';
import { MaterialModule } from '../../../material/material.module';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { CategoriesComponent } from '../../../shared/components/categories/categories.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses/courses.service';
import { Category, Course } from '../../../core/models/course.model';

@Component({
  selector: 'views-courses-page',
  standalone: true,
  imports: [
    CoursesListComponent,
    MaterialModule,
    PaginationComponent,
    CommonModule,
    CategoriesComponent,
    FilterComponent
],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css'
})

export class CoursesPageComponent {
  courses: Course[] = [];
  categories: Category[] = [];
  selectedCategories: number[] = [];
  selectedPrice: string = '';
  selectedOrder: string = '';

  constructor(private coursesSvc: CoursesService) { }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.coursesSvc.getFilteredCourses(this.selectedCategories, this.selectedPrice, this.selectedOrder)
      .subscribe(courses => {
        this.courses = courses;
      });
  }

  onCategorySelected(categoryId: number, selected: boolean) {
    if (selected) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.loadCourses();
  }

  onPriceSelected(price: string) {
    this.selectedPrice = price;
    this.loadCourses();
  }

  onOrderSelected(orderBy: string) {
    this.selectedOrder = orderBy;
    this.loadCourses();
  }
}
