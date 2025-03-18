import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Class } from '../../core/models/class.model';

@Component({
  selector: 'app-create-class-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  template: `
    <h2 mat-dialog-title>Crear Nueva Clase</h2>
    <mat-dialog-content>
      <form [formGroup]="classForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tema de la clase</mat-label>
          <input matInput formControlName="topic" placeholder="Introducción a la programación" required>
          <mat-error *ngIf="classForm.get('topic')?.invalid">
            El tema de la clase es requerido
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha de la clase</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="class_date" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="classForm.get('class_date')?.invalid">
            La fecha de la clase es requerida
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="classForm.invalid" (click)="save()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class CreateClassDialogComponent {
  classForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number }
  ) {
    this.classForm = this.fb.group({
      topic: ['', Validators.required],
      class_date: [new Date(), Validators.required]
    });
  }

  save(): void {
    if (this.classForm.valid) {
      const newClass: Partial<Class> = {
        ...this.classForm.value,
        course_id: this.data.courseId
      };
      this.dialogRef.close(newClass);
    }
  }
} 