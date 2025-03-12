import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Assist } from '../../core/models/assist.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssistService {
  private apiUrl: string = 'http://localhost:3001/api/assists/';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las asistencias de un estudiante
   */
  getAssistsByStudentId(studentId: number): Observable<Assist[]> {
    return this.http.get<any>(`${this.apiUrl}view/${studentId}`).pipe(
      map(response => {
        if (response && response.assistance && Array.isArray(response.assistance)) {
          return response.assistance;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error obteniendo asistencias del estudiante:', error);
        return of([]);
      })
    );
  }
  
  /**
   * Obtiene todas las asistencias para una clase específica
   */
  getAssistsByClassId(classId: number): Observable<Assist[]> {
    return this.http.get<any>(`${this.apiUrl}class/${classId}`).pipe(
      map(response => {
        console.log('Respuesta getAssistsByClassId:', response);
        
        // Manejar diferentes formatos de respuesta del backend
        if (response && response.assists && Array.isArray(response.assists)) {
          return response.assists;
        } else if (response && response.assistance && Array.isArray(response.assistance)) {
          return response.assistance;
        } else if (Array.isArray(response)) {
          return response;
        }
        
        return [];
      }),
      catchError(error => {
        console.error(`Error obteniendo asistencias para clase ${classId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Registra o actualiza la asistencia de un estudiante a una clase
   * El backend determina si crear un nuevo registro o actualizar uno existente
   */
  registerAssist(assist: Assist): Observable<Assist> {
    return this.http.post<Assist>(`${this.apiUrl}register`, assist).pipe(
      catchError(error => {
        console.error('Error al registrar asistencia:', error);
        throw error; // Re-lanzar el error para que el componente pueda manejarlo
      })
    );
  }
}

