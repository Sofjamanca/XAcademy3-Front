import { Component, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CoursesService } from '../../../services/courses/courses.service';
import { MatSelectionListChange } from '@angular/material/list';

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
  @Output() categorySelected = new EventEmitter<{ categoryId: number; selected: boolean }>();
  categories: { id: number; title: string }[] = [];

  constructor(private coursesSvc: CoursesService) { }

  ngOnInit() {
    this.coursesSvc.getCategories().subscribe(categories => {
      this.categories = categories.map(category => ({
        id: category.id ?? 0,
        title: category.title
      }));
    });
  }

  onCategoryChange(event: MatSelectionListChange) {
    event.options.forEach(option => {
      this.categorySelected.emit({
        categoryId: option.value,
        selected: option.selected
      });
    });
  }
}
