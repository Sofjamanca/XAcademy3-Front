import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private baseUrl = 'http://localhost:3001/api/payments';

  constructor(private http: HttpClient) {}

  getPaymentsByStudent(studentId: number, status: string): Observable<any> {
    const url = `${this.baseUrl}/statusandstudent/${studentId}?status=${status}`;
    return this.http.get<any>(url);
  }

  registerPayment(studentId: number, courseId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pay`, { student_id: studentId, course_id: courseId });
  }

  getAllPayments(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/`);
  }
  
  getPaymentsByStatus(status: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/status/${status}`).pipe(
      map(response => {
        if (response && response.payments) {
          return response.payments;
        } else if (Array.isArray(response)) {
          return response;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error(`Error obteniendo pagos con estado ${status}:`, error);
        return [];
      })
    );
  }
  
  getPaymentById(paymentId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/view/${paymentId}`);
  }
  
  getAllPaymentsWithoutFilter(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/`);
  }
}
