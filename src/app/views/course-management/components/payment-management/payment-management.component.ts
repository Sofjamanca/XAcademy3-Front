import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Student } from '../../../../core/models/student.model';
import { Course } from '../../../../core/models/course.model';
import { PaymentsService } from '../../../../services/payments/payments.service';
import { NotificationService } from '../../../../services/notification/notification.service';

interface Payment {
  id: number;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css']
})
export class PaymentManagementComponent implements OnInit {
  @Input() students: Student[] = [];
  @Input() course: Course | null = null;
  @Input() loadingStudents: boolean = false;

  displayedPaymentColumns: string[] = ['name', 'email', 'amount', 'date', 'status', 'actions'];

  constructor(
    private paymentsService: PaymentsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // No necesita inicialización especial, los datos vienen desde el componente padre
  }

  registerPayment(student: Student): void {
    if (!this.course || !student) {
      this.notificationService.showError('Error: No se puede registrar el pago sin información del curso o estudiante');
      return;
    }

    const studentId = student.student_id || student.id;
    const courseId = this.course.id;

    if (!studentId || !courseId) {
      this.notificationService.showError('Error: ID de estudiante o curso no válido');
      return;
    }

    // Registrar pago 
    this.paymentsService.registerPayment(studentId, courseId).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('Pago registrado correctamente');
        
        // Actualizar el estado de pago del estudiante en la UI
        student.payment_status = 'PAGADO';
        
        // Si el estudiante no tiene un array de pagos, crear uno
        if (!student.payments) {
          student.payments = [];
        }
        
        // Agregar el nuevo pago al array de pagos del estudiante (usando la información que tenemos)
        const newPayment: Payment = {
          id: response.id || 0,
          amount: this.course!.price || 0,
          date: new Date().toISOString(),
          status: 'paid'
        };
        
        student.payments.push(newPayment);
      },
      error: (error: any) => {
        console.error('Error al registrar pago:', error);
        this.notificationService.showError('Error al registrar el pago');
      }
    });
  }
}
