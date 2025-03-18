import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl: string = 'http://localhost:3001/api/inscriptions';
  private studentsUrl: string = 'http://localhost:3001/api/students';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  getAllInscriptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  getInscriptionsByCourse(courseId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses/${courseId}`);
  }

  getInscriptionsByStudent(): Observable<any> {
    return this.http.get(`${this.baseUrl}/view`);
  }

  enrollStudent(inscriptionData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/enroll`, inscriptionData);
  }

  saveStudentData(studentData: any) {
    this.localStorageService.setItem('studentData', JSON.stringify(studentData));
  }

  updateStudentData(studentData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, studentData);
  }

  getStudentData(): any {
    const data = this.localStorageService.getItem('studentData');
    return data ? JSON.parse(data) : null;
  }
  
  getStudentByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/student/${userId}`);
  }

  getStudentById(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.studentsUrl}/view/${studentId}`);
  }

  updateStudentGrade(studentId: number, qualification: number): Observable<any> {
    return this.http.put<any>(`${this.studentsUrl}/update-grade/${studentId}`, { qualification });
  }

  assignFinalGrade(studentId: number, qualification: number): Observable<any> {
    return this.http.post<any>(`${this.studentsUrl}/qualify/${studentId}`, { qualification });
  }

  getConditionByStudentId(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.studentsUrl}/condition/${studentId}`);
  }

  getAttendancePercentage(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.studentsUrl}/${studentId}/attendance/`);
  }

}