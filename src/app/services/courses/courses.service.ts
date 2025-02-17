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
    },
    {
      title: 'Curso de Electricidad',
      description: 'Aprende a instalar cables y sistemas eléctricos en tu hogar',
      price: 50,
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
      price: 0,
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
      price: 0,
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
      price: 10,
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
      price: 20,
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
      price: 70,
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
      price: 60,
    },
    {
      title: 'Curso de Ceramica',
      description: 'Aprende todo sobre la ceramica',
      price: 0,
    }
  ]


  private filterSubject = new BehaviorSubject<string>('todos'); // Estado inicial vacío
  filter$ = this.filterSubject.asObservable(); // Observable para suscribirse

  setFilter(filter: string) {
    this.filterSubject.next(filter); // Actualiza el filtro
  }

}
