import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl: string = 'http://localhost:3001/api/certificates/';
  constructor(private http: HttpClient) {
   }

  getCertificates(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}view/${studentId}`);
  }

  generarCertificado(studentId: number, courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}generar-certificado`, { student_id: studentId, course_id: courseId });
  }
}
