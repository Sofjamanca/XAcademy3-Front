import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, Course } from '../../core/models/course.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl: string = 'http://localhost:3001/api/courses/';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}view/${id}`);
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

  getFilteredCourses(categories: number[], price: string, orderBy: string): Observable<Course[]> {
    let params = new HttpParams();

    if (categories.length > 0) {
      params = params.set('categories', categories.join(','));
    }
    if (price) {
      params = params.set('price', price);
    }
    if (orderBy) {
      params = params.set('orderBy', orderBy);
    }

    return this.http.get<Course[]>(`${this.apiUrl}filter`, { params });
  }

}
