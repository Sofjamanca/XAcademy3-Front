import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../core/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl: string = 'http://localhost:3001/courses/';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}${id}`);
  }

  addCourse(newCourse: Course): Observable<string> {
    return this.http.post<string>(this.apiUrl, newCourse);
  }

  updateCourse(course: Course): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}${course.id}`, course);
  }

  // disableCourse(id: number): Observable<string> {
  // }


  // enableCourse(id: number): Observable<string> {
  // }

  courses: Course[] = [
    {
      title: 'Curso de Plomería',
      description: 'Aprende a instalar tuberías y sistemas de agua en tu hogar',
    },
    {
      title: 'Curso de Electricidad',
      description: 'Aprende a instalar cables y sistemas eléctricos en tu hogar',
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
    }
  ]




}
