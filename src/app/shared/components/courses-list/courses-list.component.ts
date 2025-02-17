import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { Course } from '../../../core/models/course.model';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-courses-list',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css'
})

export class CoursesListComponent implements OnInit, OnDestroy {

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  btnContent: string = 'Ver curso';
  private filterSubscription!: Subscription;

  constructor(private coursesSvc: CoursesService) { }

  ngOnInit() {
    this.courses = this.coursesSvc.courses || [];
    this.filteredCourses = [...this.courses];
    this.filterSubscription = this.coursesSvc.filter$.subscribe(filter => {
      this.applyFilters(filter);
    });
  }

  applyFilters(filter: string) {
    if (!this.courses) return;

    if (!filter || filter === 'todos') {
      this.filteredCourses = [...this.courses];
    } else if (filter === 'gratuitos') {
      this.filteredCourses = this.courses.filter(course => course.price === 0);
    } else if (filter === 'arancelados') {
      this.filteredCourses = this.courses.filter(course => course.price > 0);
    }
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

}
