import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../../core/models/teacher.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private baseUrl: string = 'http://localhost:3001/api/teachers/';

  constructor(private http: HttpClient) { }

  getTeachers() {
    return this.http.get<Teacher[]>(`${this.baseUrl}all`);
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<{ teacher: Teacher }>(`${this.baseUrl}view/${id}`).pipe(
      map(response => response.teacher)
    );
  }
  
  createTeacher(teacher: Teacher) {
    return this.http.post<Teacher>(`${this.baseUrl}create`, teacher);
  }

  updateTeacher(id: number, teacher: Teacher) {
    return this.http.put<Teacher>(`${this.baseUrl}${id}`, teacher);
  }

  deleteTeacher(id: number) {
    return this.http.delete<Teacher>(`${this.baseUrl}${id}`);
  }

  getTeachersCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}count`);
  }

  // Método para asignar el rol de profesor a un usuario existente
  assignTeacherRole(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/assign-role`, userData);
  }
}



