import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../../core/models/teacher.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private baseUrl: string = 'http://localhost:3001/api/teachers/';

  constructor(private http: HttpClient) { }

  getTeachers() {
    return this.http.get<Teacher[]>(`${this.baseUrl}all`);
  }

  getTeacherById(id: number) {
    return this.http.get<Teacher>(`${this.baseUrl}${id}`);
  }

  createTeacher(teacher: Teacher) {
    return this.http.post<Teacher>(this.baseUrl, teacher);
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
}


