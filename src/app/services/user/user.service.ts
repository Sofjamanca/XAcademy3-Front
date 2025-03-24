import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, catchError} from 'rxjs/operators';
import { ApiService } from '../api.service';
import { StudentService } from '../student/student.service';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private studentIdSubject = new BehaviorSubject<number | null>(null);
  public studentId$ = this.studentIdSubject.asObservable();
  private userNameSubject: BehaviorSubject<string | null>;
  userName$: Observable<string | null>;
  private baseUrl: string = 'http://localhost:3001/api/users';

  constructor(private localStorageService: LocalStorageService, private http: HttpClient,
    private apiService: ApiService,
    private studentService:StudentService
  ) {
    const userName = this.localStorageService.getItem('userName');
    this.userNameSubject = new BehaviorSubject<string | null>(userName || null);
    this.userName$ = this.userNameSubject.asObservable();
    this.loadStudentId();
  }

  setUserName(name: string | null): void {
    this.userNameSubject.next(name);
  }
  // user.service.ts
  clearUserName(): void {
    this.localStorageService.removeItem('userName');
    this.userNameSubject.next(null);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  loadStudentId(): void {
    this.apiService.getMe().pipe(
      switchMap((data: any) => {
        const userId = data.user_id;
        if (!userId) return of(null);
        return this.studentService.getStudentByUserId(userId);
      }),
      map((response: any) => response?.student?.id || null),
      catchError(() => of(null)) // No tirar error, solo devolver null si no hay student
    ).subscribe((studentId: number | null) => {
      this.studentIdSubject.next(studentId);
    });
  }

  getStudentId(): Observable<number | null> {
    return this.studentIdSubject.asObservable();
  }
}  