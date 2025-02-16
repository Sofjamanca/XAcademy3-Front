import { Component } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { Course } from '../../../core/models/course.model';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shared-courses-list',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css'
})
export class CoursesListComponent {

  courses?: Course[];
  btnContent: string = 'Ver curso';

  constructor(private coursesSvc: CoursesService) { }

  ngOnInit() {
    this.coursesSvc.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

}
