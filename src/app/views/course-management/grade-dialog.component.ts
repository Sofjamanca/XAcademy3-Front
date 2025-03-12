import { Component, Inject } from '@angular/core';
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
        <p><strong>Condición actual:</strong> 
          <span class="status-badge" 
                [ngClass]="{
                  'status-active': data.student.studentCondition === 'EN_CURSO',
                  'status-completed': data.student.studentCondition === 'APROBADO',
                  'status-suspended': data.student.studentCondition === 'SUSPENDIDO'
                }">
            {{ data.student.studentCondition === 'EN_CURSO' ? 'En curso' : 
               data.student.studentCondition === 'APROBADO' ? 'Aprobado' : 
               data.student.studentCondition === 'SUSPENDIDO' ? 'Suspendido' : 'No definido' }}
          </span>
        </p>
      </div>

      <form [formGroup]="gradeForm" class="grade-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Calificación</mat-label>
          <input matInput type="number" min="0" max="10" step="0.1" formControlName="qualification" placeholder="Ej: 8.5">
          <mat-hint>Ingrese un valor entre 0 y 10</mat-hint>
          <mat-error *ngIf="gradeForm.get('qualification')?.hasError('required')">
            La calificación es requerida
          </mat-error>
          <mat-error *ngIf="gradeForm.get('qualification')?.hasError('min') || gradeForm.get('qualification')?.hasError('max')">
            La calificación debe estar entre 0 y 10
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Condición del Estudiante</mat-label>
          <mat-select formControlName="studentCondition">
            <mat-option value="EN_CURSO">En curso</mat-option>
            <mat-option value="APROBADO">Aprobado</mat-option>
            <mat-option value="SUSPENDIDO">Suspendido</mat-option>
          </mat-select>
          <mat-error *ngIf="gradeForm.get('studentCondition')?.hasError('required')">
            La condición es requerida
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
    .status-suspended {
      background-color: #f44336;
      color: white;
    }
    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class GradeDialogComponent {
  gradeForm: FormGroup;
  processing: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GradeDialogComponent>,
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
  }

  submitGrade(): void {
    if (this.gradeForm.invalid) return;
    
    this.processing = true;
    
    // todo: cuando este listo el backend dar funcionalidad a este metodo
    setTimeout(() => {
      const gradeData = {
        student_id: this.data.student.student_id,
        course_id: this.data.courseId,
        ...this.gradeForm.value
      };
      this.dialogRef.close(gradeData);
    }, 1000);
  }
} 