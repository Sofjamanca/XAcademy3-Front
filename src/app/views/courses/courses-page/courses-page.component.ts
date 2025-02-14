import { Component } from '@angular/core';
import { CoursesListComponent } from '../../../shared/components/courses-list/courses-list.component';

@Component({
  selector: 'views-courses-page',
  standalone: true,
  imports: [
    CoursesListComponent
  ],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css'
})
export class CoursesPageComponent {

}
