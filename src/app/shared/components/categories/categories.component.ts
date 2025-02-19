import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CoursesService } from '../../../services/courses/courses.service';

@Component({
  selector: 'shared-categories',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories: string[] = [];

  constructor(private coursesSvc: CoursesService) { }

  ngOnInit() {
    this.coursesSvc.getCategories().subscribe(categories => {
      this.categories = categories.map(category => category.title);
    });
  }
}
