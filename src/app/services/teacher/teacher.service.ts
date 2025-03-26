import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher, TeacherResponse } from '../../core/models/teacher.model';
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

  getTeacherById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}view/${id}`);
  }

  getTeacherByIdCourse(id: number): Observable<Teacher> {
    return this.http.get<{teacher: Teacher}>(`${this.baseUrl}view/${id}`).pipe(
    map(response => response.teacher)
  );
  }

  getTeacherByUserId(userId: number) {
    return this.http.get<Teacher>(`${this.baseUrl}user/${userId}`);
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

  getOrderedTeachers(
    column: string = '', 
    direction: string = 'asc',
    page: number = 1, 
    limit: number = 10
  ): Observable<TeacherResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (column) {
      params = params.set('column', column);
      params = params.set('direction', direction);
    }

    return this.http.get<TeacherResponse>(`${this.baseUrl}ordered`, { params });
  }
}



