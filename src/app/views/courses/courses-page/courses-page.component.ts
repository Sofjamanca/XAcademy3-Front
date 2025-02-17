import { Component } from '@angular/core';
import { CoursesListComponent } from '../../../shared/components/courses-list/courses-list.component';
import { MaterialModule } from '../../../material/material.module';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { CategoriesComponent } from '../../../shared/components/categories/categories.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'views-courses-page',
  standalone: true,
  imports: [
    CoursesListComponent,
    MaterialModule,
    FilterComponent,
    CategoriesComponent,
    PaginationComponent,
    CommonModule
  ],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css'
})

export class CoursesPageComponent {

}

