import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

