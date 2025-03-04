import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl: string = 'http://localhost:3001/api/inscriptions';


  constructor(private http: HttpClient) { }

  getAllInscriptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  getInscriptionsByCourse(courseId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/course/${courseId}`);
  }

  getInscriptionsByStudent(studentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/student/${studentId}`);
  }

  enrollStudent(inscriptionData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/enroll`, inscriptionData);
  }

  saveStudentData(studentData: any) {
    localStorage.setItem('studentData', JSON.stringify(studentData));
  }

  getStudentData(): any {
    const data = localStorage.getItem('studentData');
    return data ? JSON.parse(data) : null;
  }

}
