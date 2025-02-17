import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
      price: 100,
      updatedAt: '2024-01-10T12:00:00Z',
    },
    {
      title: 'Curso de Electricidad',
      description: 'Aprende a instalar cables y sistemas eléctricos en tu hogar',
      price: 50,
      updatedAt: '2024-02-10T12:00:00Z',
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
      price: 0,
      updatedAt: '2024-03-10T12:00:00Z',
    },
    {
      title: 'Curso de Fotografia',
      description: 'Aprende todo sobre la ceramica',
      price: 0,
      updatedAt: '2024-04-10T12:00:00Z',
    },
    {
      title: 'Curso de Cocina',
      description: 'Aprende todo sobre la ceramica',
      price: 10,
      updatedAt: '2024-05-10T12:00:00Z',
    },
    {
      title: 'Curso de Tejido',
      description: 'Aprende todo sobre la ceramica',
      price: 20,
      updatedAt: '2024-06-10T12:00:00Z',
    },
    {
      title: 'Curso de Costura',
      description: 'Aprende todo sobre la ceramica',
      price: 70,
      updatedAt: '2024-07-10T12:00:00Z',
    },
    {
      title: 'Curso de Uñas',
      description: 'Aprende todo sobre la ceramica',
      price: 60,
      updatedAt: '2024-08-10T12:00:00Z',
    },
    {
      title: 'Curso de Maquillaje',
      description: 'Aprende todo sobre la ceramica',
      price: 0,
      updatedAt: '2024-09-15T08:30:00Z',
    }
  ];

  private filterSubject = new BehaviorSubject<string>('todos');
  private orderSubject = new BehaviorSubject<string>('fecha');

  filter$ = this.filterSubject.asObservable();
  order$ = this.orderSubject.asObservable();

  setFilter(filter: string) {
    this.filterSubject.next(filter);
  }

  setOrder(order: string) {
    this.orderSubject.next(order);
  }

  getOrder(): string {
    return this.orderSubject.getValue();
  }

}
