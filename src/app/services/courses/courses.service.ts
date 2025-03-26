import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, Course, CourseResponse } from '../../core/models/course.model';
import { Observable, tap } from 'rxjs';

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

  updateCourse(courseId: number, courseData: any): Observable<any> {
    return this.http.put<string>(`${this.apiUrl}update/${courseId}`, courseData);
  }
  

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}categories`);
  }

  addCategory(newCategory: Category): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}categories/create`, newCategory);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}categories/view/${id}`);
  }

  updateCategory(category: Category): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}categories/${category.id}`, category);
  }

  getCoursesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}count`);
  }

  searchCourses(searchTerm: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}search/${searchTerm}`).pipe(
      tap(() => {})
    );
  }

  enableDisableCourse(id: number, active: boolean): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}active/${id}`, { active });
   }

  getFilteredCourses(
    categories: number[] = [],
    price: string = '',
    orderBy: string = '',
    page: number = 1,
    limit: number = 10

  ): Observable<CourseResponse> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());

    if (categories.length > 0) {
      params = params.set('categories', categories.join(','));
    }
    if (price) {
      params = params.set('price', price);
    }
    if (orderBy) {
      params = params.set('orderBy', orderBy);
    }

    return this.http.get<CourseResponse>(`${this.apiUrl}filter`, { params });
  }

  getLastestCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}lastest`);
  }

  getOrderedCourses(
    column: string = '', 
    direction: string = 'asc',
    page: number = 1, 
    limit: number = 10
  ): Observable<CourseResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (column) {
      params = params.set('column', column);
      params = params.set('direction', direction);
    }

    return this.http.get<CourseResponse>(`${this.apiUrl}ordered`, { params });
  }

  getActiveCourses(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}active`);
  }

}
