import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses/courses.service';
import { Course } from '../../core/models/course.model';
import { FindPendingPaymentPipe } from './find-pending-payment.pipe';

interface Student {
  id: number;
  name: string;
  email: string;
  attendance?: {
    present: boolean;
    date: string;
  }[];
  payments?: {
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'overdue';
  }[];
}

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FindPendingPaymentPipe
  ],
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  courseId: number | null = null;
  course: Course | null = null;
  students: Student[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedTabIndex: number = 0;
  
  // Datos para la tabla de asistencias
  displayedAttendanceColumns: string[] = ['name', 'email', 'present', 'actions'];
  
  // Datos para la tabla de pagos
  displayedPaymentColumns: string[] = ['name', 'email', 'amount', 'date', 'status', 'actions'];
  
  // Fecha actual para el registro de asistencia
  currentDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = +id;
        this.loadCourseDetails();
      } else {
        this.error = 'ID de curso no válido';
        this.loading = false;
      }
    });
  }

  loadCourseDetails(): void {
    if (!this.courseId) return;
    
    this.loading = true;
    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.loadStudents();
      },
      error: (error) => {
        console.error('Error al cargar los detalles del curso:', error);
        this.error = 'Error al cargar los detalles del curso';
        this.loading = false;
      }
    });
  }

  loadStudents(): void {

    setTimeout(() => {
      // Datos simulados
      this.students = [
        {
          id: 1,
          name: 'Ana García',
          email: 'ana.garcia@email.com',
          attendance: [
            { present: true, date: '2025-03-01' },
            { present: true, date: '2025-03-08' }
          ],
          payments: [
            { amount: 2000, date: '2025-03-01', status: 'paid' },
            { amount: 2000, date: '2025-04-01', status: 'pending' }
          ]
        },
        {
          id: 2,
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          attendance: [
            { present: false, date: '2025-03-01' },
            { present: true, date: '2025-03-08' }
          ],
          payments: [
            { amount: 2000, date: '2025-03-01', status: 'paid' },
            { amount: 2000, date: '2025-04-01', status: 'overdue' }
          ]
        }
      ];
      this.loading = false;
    }, 1000);
  }

  // Método para cambiar el estado de asistencia de un estudiante
  toggleAttendance(student: Student): void {
    const todayAttendance = student.attendance?.find(a => a.date === this.currentDate);
    
    if (todayAttendance) {
      todayAttendance.present = !todayAttendance.present;
    } else {
      if (!student.attendance) {
        student.attendance = [];
      }
      student.attendance.push({
        present: true,
        date: this.currentDate
      });
    }
    
    // Aquí se debería guardar la asistencia en el backend
    console.log(`Asistencia actualizada para ${student.name}: ${student.attendance}`);
  }

  // Método para registrar un pago
  registerPayment(student: Student): void {
    // Buscar el próximo pago pendiente
    const pendingPayment = student.payments?.find(p => p.status === 'pending' || p.status === 'overdue');
    
    if (pendingPayment) {
      pendingPayment.status = 'paid';
      pendingPayment.date = new Date().toISOString().split('T')[0];
      
      // Aquí se debería guardar el pago en el backend
      console.log(`Pago registrado para ${student.name}: ${pendingPayment.amount}`);
    }
  }

  // Método para volver a la página de perfil del profesor
  goBack(): void {
    this.router.navigate(['/teacher-profile']);
  }

  // Método para editar la información del curso
  editCourseInfo(): void {
    // Implementación para editar la información del curso
    console.log('Editar información del curso');
  }

  // Método para obtener el estado de asistencia de un estudiante en una fecha específica
  getAttendanceStatus(student: Student, date: string): boolean {
    const attendance = student.attendance?.find(a => a.date === date);
    return attendance ? attendance.present : false;
  }
} 