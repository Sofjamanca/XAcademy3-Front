import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Student } from '../../../../core/models/student.model';
import { NotificationService } from '../../../../services/notification/notification.service';
import { StudentService } from '../../../../services/student/student.service';
import { GradeDialogComponent } from '../../grade-dialog.component';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  @Input() students: Student[] = [];
  @Input() courseId: number | null = null;
  @Input() loadingStudents: boolean = false;

  displayedStudentColumns: string[] = ['name', 'email', 'condition', 'calification', 'actions'];

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // No necesita inicialización especial, los datos vienen desde el componente padre
  }

  gradeStudent(student: Student): void {
    if (!student || !student.student_id || !this.courseId) {
      this.notificationService.showError('No se puede calificar al estudiante: información incompleta');
      return;
    }

    const dialogRef = this.dialog.open(GradeDialogComponent, {
      width: '400px',
      data: {
        student: student,
        courseId: this.courseId
      }
    });

    dialogRef.afterClosed().subscribe(gradeData => {
      if (gradeData) {
        this.saveStudentGrade(student, gradeData);
      }
    });
  }

  private saveStudentGrade(student: Student, gradeData: any): void {
    if (!student.student_id || !this.courseId) return;
    
    this.studentService.updateStudentGrade({
      student_id: student.student_id,
      course_id: this.courseId,
      qualification: gradeData.grade,
      studentCondition: student.studentCondition || 'Regular',
      comments: gradeData.comments
    }).subscribe({
      next: () => {
        // Actualizar calificación localmente
        student.qualification = gradeData.grade;
        this.notificationService.showSuccess('Calificación guardada correctamente');
      },
      error: (error: any) => {
        console.error('Error al guardar calificación:', error);
        this.notificationService.showError('Error al guardar la calificación');
      }
    });
  }
} 