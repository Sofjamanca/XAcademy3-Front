import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, Course } from '../../core/models/course.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl: string = 'http://localhost:3001/api/courses/';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}${id}`);
  }

  addCourse(newCourse: Course): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}create`, newCourse);
  }

  updateCourse(course: Course): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}${course.id}`, course);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}categories`);
  }

  addCategory(newCategory: Category): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}categories/create`, newCategory);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}categories/${id}`);
  }

  updateCategory(category: Category): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}categories/${category.id}`, category);
  }

  getCoursesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}count`);
  }
  // disableCourse(id: number): Observable<string> {
  // }


  // enableCourse(id: number): Observable<string> {
  // }


  //private filterSubject = new BehaviorSubject<string>('todos');
  //private orderSubject = new BehaviorSubject<string>('fecha');

  //filter$ = this.filterSubject.asObservable();
  //order$ = this.orderSubject.asObservable();

  //setFilter(filter: string) {
  //  this.filterSubject.next(filter);
  //}

  /*setOrder(order: string) {
    this.orderSubject.next(order);
  }

  getOrder(): string {
    return this.orderSubject.getValue();
  }*/

}
