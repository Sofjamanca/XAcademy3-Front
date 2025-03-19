import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl: string = 'http://localhost:3001/api/certificates/';

  constructor(private http: HttpClient) { }
 
  downloadCertificate(studentId: number, courseId: number): Observable<Blob> {
    const body = { student_id: studentId, course_id: courseId };
    return this.http.post(this.apiUrl + 'generar-certificado', body, {
      responseType: 'blob',
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error al descargar el certificado:', error);
    return throwError(error);
  }
  downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
