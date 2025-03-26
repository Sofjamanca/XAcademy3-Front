import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, Course } from '../../core/models/course.model';
import { Observable, tap } from 'rxjs';
import { Class } from '../../core/models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl: string = 'http://localhost:3001/api/classes/';

  constructor(private http: HttpClient) { }

  getClassesByCourseId(courseId: number): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.apiUrl}course/${courseId}`);
  }

  getCountClassesByCourseId(courseId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}count/${courseId}`);
  }

  createClass(newClass: Class): Observable<Class> {
    return this.http.post<Class>(`${this.apiUrl}newclase`, newClass);
  }
  
  getCountTotalClass(studentId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}totalClasses/${studentId}`); 
  }

}