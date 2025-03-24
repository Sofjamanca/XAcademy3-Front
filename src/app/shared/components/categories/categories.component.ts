import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CoursesService } from '../../../services/courses/courses.service';
import { CommonModule } from '@angular/common';
import { MatSelectionListChange } from '@angular/material/list';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'shared-categories',
  standalone: true,
  imports: [MaterialModule, CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  @Input() selectedCategories: number[] = [];
  @Input() loading: boolean = true;
  @Output() categorySelected = new EventEmitter<{
    categoryId: number;
    selected: boolean;
  }>();
  categories: { id: number; title: string }[] = [];

  constructor(private coursesSvc: CoursesService) {}

  ngOnInit() {
    this.loading = true;
    this.coursesSvc.getCategories().subscribe((categories) => {
      this.categories = categories.map((category) => ({
        id: category.id ?? 0,
        title: category.title,
      }));
      this.loading = false;
    });
  }

  onCategoryChange(event: MatSelectionListChange) {
    event.options.forEach((option) => {
      const categoryId = option.value;
      const selected = option.selected;

      this.categorySelected.emit({
        categoryId,
        selected,
      });

      if (selected) {
        if (!this.selectedCategories.includes(categoryId)) {
          this.selectedCategories = [...this.selectedCategories, categoryId];
        }
      } else {
        this.selectedCategories = this.selectedCategories.filter(
          (id) => id !== categoryId
        );
      }
    });
  }

  isSelected(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId);
  }
}
