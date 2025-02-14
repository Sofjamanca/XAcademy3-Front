import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';

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
  categories: string[] = ['Hogar', 'Textil', 'Manualidades', 'Fotografía', 'Belleza'];
}
