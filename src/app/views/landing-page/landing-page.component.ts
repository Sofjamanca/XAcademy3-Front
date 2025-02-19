import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { CoursesService } from '../../services/courses/courses.service';
import { Category, Course } from '../../core/models/course.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'views-landing-page',
  standalone: true,
  imports: [
    HeroComponent,
    CardComponent,
    CommonModule
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'

})
export class LandingPageComponent {

  courses?: Course[];
  categories?: Category[];
  btnContent: string = 'Ver curso';

  constructor(private coursesSvc: CoursesService) { }

  ngOnInit() {
    this.coursesSvc.getCourses().subscribe(courses => {
      this.courses = courses;
    });

    this.coursesSvc.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  getCategoryTitle(category_id?: number): string {
    return this.categories?.find(cat => cat.id === category_id)?.title || 'Sin categoría';
  }

  // onActionClick(): {
  // }
}
