import { Component, OnInit, ChangeDetectorRef, AfterViewChecked  } from '@angular/core';
import { PaymentsService } from '../../../services/payments/payments.service';
import { StudentService } from '../../../services/student/student.service';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { CoursesService } from '../../../services/courses/courses.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, MaterialModule],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent implements OnInit, AfterViewChecked {
  payments: any[] = [];
  studentId: number | null = null;
  userId: number | null = null;
  pendingPayments: any[] = [];
  completedPayments: any[] = [];
  private paymentUpdated$ = new BehaviorSubject<boolean>(false);


  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private studentService: StudentService,
    private paymentsService: PaymentsService,
    private coursesService: CoursesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserData(); 
    this.paymentUpdated$;
  }
  
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }


  getUserData(): void {
    this.apiService.getMe().subscribe(
      (data: any) => {
        this.userId = data.user_id;
        if (this.userId) {
          this.getStudentIdByUserId(this.userId);
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
        this.snackBar.open('Error al obtener los datos del usuario', 'Cerrar', { duration: 3000 });
      }
    );
  }

  getStudentIdByUserId(userId: number): void {
    this.studentService.getStudentByUserId(userId).subscribe(
      (response: any) => {
        if (response && response.student && response.student.id) {
          this.studentId = response.student.id;
          this.loadPayments();
        } else {
          console.error('No se encontró el id en la respuesta');
        }
      },
      (error) => {
        console.error('Error al obtener el student_id:', error);
        this.snackBar.open('Error al obtener el ID del estudiante', 'Cerrar', { duration: 3000 });
      }
    );
  }

  loadPayments(): void {
    if (this.studentId !== null) {
      this.paymentsService.getPaymentsByStudent(this.studentId, 'PENDIENTE').subscribe({
        next: (data) => {
          this.pendingPayments = data.payments;
          this.pendingPayments.forEach(payment => {
            this.getCourseData(payment);
          });
        },
        error: (error) => {
          console.error('Error al obtener los pagos pendientes:', error);
        }
      });

      this.paymentsService.getPaymentsByStudent(this.studentId, 'PAGADO').subscribe({
        next: (data) => {
          this.completedPayments = data.payments;
          this.completedPayments.forEach(payment => {
            this.getCourseData(payment);
          });
        },
        error: (error) => {
          console.error('Error al obtener los pagos realizados:', error);
        }
      });
    } else {
      console.error('No se ha encontrado un ID de estudiante válido.');
      this.snackBar.open('No se ha encontrado un ID de estudiante válido.', 'Cerrar', { duration: 3000 });
    }
  }

  getCourseData(payment: any): void {
    this.coursesService.getCourseById(payment.course_id).subscribe(courseData => {
      payment.courseTitle = courseData.title;
      payment.coursePrice = courseData.price;
    });
  }

  getCourseTitle(payment: any): void {
    this.coursesService.getCourseById(payment.course_id).subscribe(courseData => {
      payment.courseTitle = courseData.title;
    });
  }

  getPrice(payment: any): void {
    this.coursesService.getCourseById(payment.course_id).subscribe(courseData => {
      console.log(courseData)
      payment.coursePrice = courseData.price;
    });
    console.log(payment.coursePrice)
  }

  pagar(payment: any): void {
    if (!this.studentId || !payment.course_id) {
      console.error('Error: No se encontró información necesaria para el pago.');
      this.snackBar.open('Faltan datos del estudiante o del curso.', 'Cerrar', { duration: 3000 });
      return;
    }
  
    this.paymentsService.registerPayment(this.studentId, payment.course_id).subscribe({
      next: () => {
        payment.status = 'PAGADO';
        payment.paymentDate = new Date();
        this.pendingPayments = this.pendingPayments.filter(p => p.id !== payment.id);
        this.completedPayments = [...this.completedPayments, payment]; 

        this.cdr.markForCheck();
        this.paymentUpdated$.next(true);
        
        this.snackBar.open(`Pago realizado con éxito`, 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
      },
      error: (error) => {
        console.error('Error al procesar el pago:', error);
        this.snackBar.open('Error al procesar el pago', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onTabChange(event: any): void {
    this.cdr.detectChanges();
  }
  
}
  
  
  