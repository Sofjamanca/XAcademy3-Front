import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AssistService } from '../../../../services/assist/assist.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { DateUtilsService } from '../../../../services/date-utils/date-utils.service';

import { Class } from '../../../../core/models/class.model';
import { Student } from '../../../../core/models/student.model';
import { Assist } from '../../../../core/models/assist.model';

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-attendance-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSlideToggleModule
  ],
  templateUrl: './attendance-management.component.html',
  styleUrls: ['./attendance-management.component.css']
})
export class AttendanceManagementComponent implements OnInit {
  @Input() courseId!: number;
  @Input() classes: Class[] = [];
  @Input() students: Student[] = [];

  displayedAttendanceColumns: string[] = ['name', 'email', 'present', 'actions'];
  expandedClassId: number | null = null;
  loadingClasses: boolean = false;
  classFilterText: string = '';
  
  // Mapa para almacenar cambios temporales de asistencia
  pendingAttendanceChanges: Map<string, {student: Student, attendance: boolean}> = new Map();
  savingAttendance: boolean = false;

  constructor(
    private assistService: AssistService,
    private notificationService: NotificationService,
    private dateUtils: DateUtilsService
  ) { }

  ngOnInit(): void {
    // No es necesario cargar clases aquí, el componente padre las pasará
  }

  get filteredClasses(): Class[] {
    // Si no hay clases, retornar un array vacío
    if (!this.classes || !Array.isArray(this.classes) || this.classes.length === 0) {
      return [];
    }
    
    // Si no hay texto de filtro, devolver todas las clases
    if (!this.classFilterText || !this.classFilterText.trim()) {
      return this.classes;
    }
    
    const filterText = this.classFilterText.toLowerCase().trim();
    
    return this.classes.filter(c => {
      if (!c) return false;
      
      // Filtrar por tema (si existe)
      if (c.topic && typeof c.topic === 'string' && c.topic.toLowerCase().includes(filterText)) {
        return true;
      }
      
      // Filtrar por fecha
      try {
        const dateStr = this.dateUtils.formatDateForFilter(c.class_date || c.created_at);
        return dateStr.toLowerCase().includes(filterText);
      } catch (error) {
        console.error('Error al formatear fecha para filtrado:', error);
        return false;
      }
    });
  }

  toggleClassExpansion(classId: number): void {
    this.expandedClassId = this.expandedClassId === classId ? null : classId;
    
    // Si se está expandiendo una clase, cargar sus asistencias
    if (this.expandedClassId) {
      try {
        this.loadClassAttendances(this.expandedClassId);
      } catch (error) {
        this.notificationService.showError('Error al expandir la clase y cargar asistencias');
        console.error('Error al expandir la clase y cargar asistencias:', error);
      }
    }
  }

  loadClassAttendances(classId: number): void {
    if (this.students.length === 0) return;
    
    this.savingAttendance = true;
    
    try {
      this.assistService.getAssistsByClassId(classId).subscribe({
        next: (assists: Assist[]) => {
          if (!assists || assists.length === 0) {
            this.savingAttendance = false;
            return;
          }
          
          // Actualizar la información de asistencia para cada estudiante
          this.students.forEach(student => {
            if (!student.attendance) {
              student.attendance = [];
            }
            
            // Buscar la asistencia del estudiante para esta clase específica por class_id
            const studentAssist = assists.find(a => 
              (a.student_id === student.student_id || a.student_id === student.id) && 
              a.class_id === classId
            );
            
            if (studentAssist) {
              // El valor attendance puede venir como booleano o como 1/0
              // Convertir a booleano para manejar ambos casos
              let isPresent = false;
              
              // Comprobar todos los posibles valores que indican asistencia positiva
              if (typeof studentAssist.attendance === 'boolean') {
                isPresent = studentAssist.attendance;
              } else if (typeof studentAssist.attendance === 'number') {
                isPresent = studentAssist.attendance === 1;
              } else if (typeof studentAssist.attendance === 'string') {
                const attendanceStr = studentAssist.attendance as string;
                isPresent = attendanceStr === '1' || attendanceStr.toLowerCase() === 'true';
              }
              
              // Reemplazar o agregar la asistencia para esta clase específica
              const existingIndex = student.attendance.findIndex(a => a.hasOwnProperty('classId') && a.classId === classId);
              
              if (existingIndex >= 0) {
                student.attendance[existingIndex].present = isPresent;
              } else {
                student.attendance.push({
                  present: isPresent,
                  date: this.dateUtils.normalizeDate(studentAssist.created_at instanceof Date ? 
                    studentAssist.created_at.toISOString() : 
                    String(studentAssist.created_at)),
                  classId: classId // Guardar el classId como referencia
                });
              }
            } else {
              // Opcional: agregar un registro de asistencia vacío/false para esta clase
              const existingIndex = student.attendance.findIndex(a => a.hasOwnProperty('classId') && a.classId === classId);
              
              if (existingIndex < 0) {
                student.attendance.push({
                  present: false,
                  date: this.dateUtils.normalizeDate(new Date().toISOString()),
                  classId: classId
                });
              }
            }
          });
          
          this.savingAttendance = false;
        },
        error: (error: any) => {
          console.error('Error al cargar asistencias:', error);
          this.savingAttendance = false;
          this.notificationService.showError('Error al cargar asistencias');
        }
      });
    } catch (error) {
      console.error('Error al intentar cargar asistencias:', error);
      this.savingAttendance = false;
      this.notificationService.showError('No se pudieron cargar las asistencias');
    }
  }

  toggleAttendance(student: Student, classId: number): void {
    if (!classId) {
      console.error('No se ha seleccionado ninguna clase');
      this.notificationService.showError('No se ha seleccionado ninguna clase');
      return;
    }

    // Verificar que el estudiante tiene un ID válido
    if (!student.student_id) {
      console.error('El estudiante no tiene un ID válido', student);
      this.notificationService.showError('Error al identificar al estudiante');
      return;
    }

    // Obtener la fecha actual normalizada para UI
    const currentDateNormalized = this.dateUtils.normalizeDate(new Date().toISOString());

    // Obtener el estado actual de asistencia y cambiarlo
    // Buscar por classId en lugar de por fecha
    const existingAttendance = student.attendance && student.attendance.find(a => 
      a.classId === classId
    );
    
    const currentStatus = existingAttendance ? existingAttendance.present : false;
    const newAttendanceStatus = !currentStatus;
    
    // Crear una clave única para identificar este cambio de asistencia
    const changeKey = `${classId}-${student.student_id}`;
    
    // Almacenar el cambio en el mapa de cambios pendientes
    this.pendingAttendanceChanges.set(changeKey, {
      student: student,
      attendance: newAttendanceStatus
    });
    
    // Actualizar la UI inmediatamente (sin enviar al servidor)
    if (!student.attendance) {
      student.attendance = [];
    }
    
    const existingIndex = student.attendance.findIndex(a => a.classId === classId);
    
    if (existingIndex >= 0) {
      student.attendance[existingIndex].present = newAttendanceStatus;
    } else {
      student.attendance.push({
        present: newAttendanceStatus,
        date: currentDateNormalized,
        classId: classId
      });
    }
  }

  getAttendanceStatus(student: Student, classId: number): boolean {
    if (!student || !student.attendance || student.attendance.length === 0) {
      return false;
    }
    
    // Buscar una entrada para este classId específico
    const record = student.attendance.find(a => a.classId === classId);
    
    return record ? record.present : false;
  }

  saveAttendanceChanges(classId: number): void {
    if (this.pendingAttendanceChanges.size === 0) {
      this.notificationService.showInfo('No hay cambios de asistencia para guardar');
      return;
    }

    this.savingAttendance = true;
    
    this.notificationService.showTemporary('Guardando cambios de asistencia...');

    // Obtener solo los cambios relevantes para esta clase
    const relevantChanges = Array.from(this.pendingAttendanceChanges.entries())
      .filter(([key]) => key.startsWith(`${classId}-`));
    
    if (relevantChanges.length === 0) {
      this.savingAttendance = false;
      this.notificationService.showInfo('No hay cambios de asistencia para esta clase');
      return;
    }
    
    // Crear un array de observables para cada cambio
    const requests = relevantChanges.map(([key, change]) => {
      const student = change.student;
      
      const assistData: Assist = {
        id: 0,
        class_id: classId,
        student_id: student.student_id!,
        attendance: Boolean(change.attendance),
        created_at: new Date(),
        updated_at: new Date()
      };

      return this.assistService.registerAssist(assistData).pipe(
        catchError(error => {
          console.error('Error al registrar asistencia:', error);
          return of({ error: true, student: student.name });
        })
      );
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        // Contar éxitos y errores
        const errorCount = results.filter(r => r && (r as any).error).length;
        const savedCount = results.length - errorCount;
        
        // Eliminar los cambios guardados del mapa de pendientes
        relevantChanges.forEach(([key]) => {
          this.pendingAttendanceChanges.delete(key);
        });
        
        this.showSaveResults(savedCount, errorCount);
        
        // Recargar las asistencias para asegurar que la UI refleja el estado actual
        if (savedCount > 0) {
          setTimeout(() => this.loadClassAttendances(classId), 500);
        }
        
        this.savingAttendance = false;
      },
      error: (error) => {
        console.error('Error al procesar las asistencias', error);
        this.savingAttendance = false;
        this.notificationService.showError('Error al guardar las asistencias');
      }
    });
  }

  // Método para mostrar resultados del guardado
  private showSaveResults(saved: number, errors: number): void {
    if (errors === 0) {
      this.notificationService.showSuccess(`¡${saved} asistencias guardadas correctamente!`);
    } else {
      this.notificationService.showError(`Guardado con errores: ${saved} exitosas, ${errors} fallidas`);
    }
  }

  getClassDate(classObj: any): string {
    try {
      // Intentar obtener la fecha desde class_date o createdAt
      const date = classObj.class_date || classObj.createdAt || classObj.created_at;
      if (!date) return 'Fecha no disponible';
      
      // Formatear la fecha
      return this.dateUtils.formatDateForDisplay(date);
    } catch (error) {
      console.error('Error al formatear fecha de clase:', error);
      return 'Error en fecha';
    }
  }
} 