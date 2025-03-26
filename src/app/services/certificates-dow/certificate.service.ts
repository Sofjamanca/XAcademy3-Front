import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl: string = 'http://localhost:3001/api/certificates';
  constructor(private http: HttpClient) {
   }

   getCertificates(studentId: number): Observable<any> {
    // Coincide con la ruta definida en el router
    return this.http.get(`${this.apiUrl}/student/${studentId}`);
  }

  generateOrDownloadCertificate(studentId: number, courseId: number): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/generate`, 
      { student_id: studentId, course_id: courseId },
      { responseType: 'blob' }
    );
  }
  checkCertificateRequirements(studentId: number, courseId: number): Observable<any> {
    console.log('curso',courseId);
    return this.http.get(`${this.apiUrl}/check/${studentId}/${courseId}`);
  }
}
