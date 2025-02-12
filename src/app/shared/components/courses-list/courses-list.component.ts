import { Component } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';

@Component({
  selector: 'shared-courses-list',
  standalone: true,
  imports: [],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css'
})
export class CoursesListComponent {

  constructor(private coursesSvc: CoursesService) { }

}
