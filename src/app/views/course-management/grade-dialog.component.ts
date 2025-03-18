import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from '../../services/student/student.service';

@Component({
  selector: 'app-grade-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Calificar Alumno</h2>
    <mat-dialog-content>
      <div class="student-info">
        <p><strong>Alumno:</strong> {{ data.student.name }}</p>
        <p><strong>Email:</strong> {{ data.student.email }}</p>
        <p><strong>Asistencia:</strong>
          <ng-container *ngIf="attendanceDetails; else loadingAttendance">
            {{ attendanceDetails.percentage }}
            <span class="attendance-details">
              ({{ attendanceDetails.attended }} de {{ attendanceDetails.total }} clases)
            </span>
          </ng-container>
          <ng-template #loadingAttendance>
            <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
          </ng-template>
        </p>
        <p><strong>Condición actual:</strong> 
          <span class="status-badge" 
                [ngClass]="{
                  'status-active': data.student.studentCondition === 'EN_CURSO',
                  'status-completed': data.student.studentCondition === 'APROBADO',
                  'status-suspended': data.student.studentCondition === 'SUSPENDIDO',
                  'status-failed': data.student.studentCondition === 'DESAPROBADO'
                }">
            {{ data.student.studentCondition === 'EN_CURSO' ? 'En curso' : 
               data.student.studentCondition === 'APROBADO' ? 'Aprobado' : 
               data.student.studentCondition === 'DESAPROBADO' ? 'Desaprobado' : 
               data.student.studentCondition === 'SUSPENDIDO' ? 'Suspendido' : 'No definido' }}
          </span>
        </p>
      </div>

      <form [formGroup]="gradeForm" class="grade-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Calificación</mat-label>
          <input matInput type="number" min="0" max="10" step="1" formControlName="qualification" placeholder="Ej: 8">
          <mat-hint>Ingrese un valor entero entre 0 y 10</mat-hint>
          <mat-error *ngIf="gradeForm.get('qualification')?.hasError('required')">
            La calificación es requerida
          </mat-error>
          <mat-error *ngIf="gradeForm.get('qualification')?.hasError('min') || gradeForm.get('qualification')?.hasError('max')">
            La calificación debe estar entre 0 y 10
          </mat-error>
        </mat-form-field>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close *ngIf="!processing">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="gradeForm.invalid || processing"
              (click)="submitGrade()">
        <mat-icon *ngIf="!processing">save</mat-icon>
        <mat-spinner *ngIf="processing" diameter="24"></mat-spinner>
        <span>{{ processing ? 'Guardando...' : 'Guardar Calificación' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .student-info {
      margin-bottom: 20px;
      background-color: #f8f8f8;
      padding: 12px;
      border-radius: 4px;
    }
    .student-info p {
      margin: 8px 0;
    }
    .grade-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
    }
    .full-width {
      width: 100%;
    }
    .status-badge {
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-active {
      background-color: #2196f3;
      color: white;
    }
    .status-completed {
      background-color: #4caf50;
      color: white;
    }
    .status-failed {
      background-color: #f44336;
      color: white;
    }
    .status-suspended {
      background-color: #f44336;
      color: white;
    }
    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
    .inline-spinner {
      display: inline-block;
      margin-left: 8px;
      vertical-align: middle;
    }
    .attendance-details {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.6);
      margin-left: 4px;
    }
  `]
})
export class GradeDialogComponent implements OnInit {
  gradeForm: FormGroup;
  processing: boolean = false;
  attendanceDetails: {
    percentage: string;
    attended: number;
    total: number;
  } | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GradeDialogComponent>,
    private studentService: StudentService,
    @Inject(MAT_DIALOG_DATA) public data: {
      student: any,
      courseId: number
    }
  ) {
    this.gradeForm = this.fb.group({
      qualification: [data.student.qualification || '', [Validators.required, Validators.min(0), Validators.max(10)]],
      studentCondition: [data.student.studentCondition || 'EN_CURSO', Validators.required],
      comments: ['']
    });
    console.log(this.data.student);
  }

  ngOnInit(): void {
    if (this.data.student.student_id) {
      this.studentService.getAttendancePercentage(this.data.student.student_id).subscribe({
        next: (response) => {
          this.attendanceDetails = {
            percentage: response.percentage,
            attended: response.attended,
            total: response.total
          };
        },
        error: (error) => {
          console.error('Error al obtener el porcentaje de asistencia:', error);
        }
      });
    }
  }

  submitGrade(): void {
    if (this.gradeForm.invalid) return;
    
    this.processing = true;
    
    // Asegurar que la calificación es un número entero
    const formValues = this.gradeForm.value;
    formValues.qualification = parseInt(formValues.qualification, 10);
    
    // todo: cuando este listo el backend dar funcionalidad a este metodo
    setTimeout(() => {
      const gradeData = {
        student_id: this.data.student.student_id,
        course_id: this.data.courseId,
        ...formValues
      };
      this.dialogRef.close(gradeData);
    }, 1000);
  }
} 