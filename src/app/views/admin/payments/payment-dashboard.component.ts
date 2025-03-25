import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { PaymentsService } from '../../../services/payments/payments.service';
import { PaymentStatusDialogComponent } from './payment-status-dialog.component';
import { CoursesService } from '../../../services/courses/courses.service';

@Component({
  selector: 'app-payment-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './payment-dashboard.component.html',
  styleUrls: ['./payment-dashboard.component.css']
})
export class PaymentDashboardComponent implements OnInit, AfterViewInit {
  // Columnas para la tabla de pagos
  pendingDisplayedColumns: string[] = ['id', 'student', 'course', 'status', 'amount', 'action'];
  approvedDisplayedColumns: string[] = ['id', 'student', 'course', 'date', 'approved', 'amount', 'action'];
  
  // Datos para las tablas
  pendingDataSource = new MatTableDataSource<any>([]);
  approvedDataSource = new MatTableDataSource<any>([]);
  activeDataSource: MatTableDataSource<any> = this.pendingDataSource;
  
  // Estados de carga
  isLoading: boolean = true;
  
  // Paginadores
  @ViewChild('pendingPaginator') pendingPaginator!: MatPaginator;
  @ViewChild('approvedPaginator') approvedPaginator!: MatPaginator;
  
  // Ordenación
  @ViewChild('pendingSort') pendingSort!: MatSort;
  @ViewChild('approvedSort') approvedSort!: MatSort;

  private courseCache: { [id: number]: any } = {};

  constructor(
    private paymentsService: PaymentsService,
    private coursesService: CoursesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllPayments();
  }

  ngAfterViewInit() {
    // Configuramos los paginadores y el ordenamiento
    if (this.pendingPaginator) {
      this.pendingDataSource.paginator = this.pendingPaginator;
    }
    if (this.pendingSort) {
      this.pendingDataSource.sort = this.pendingSort;
    }
    
    if (this.approvedPaginator) {
      this.approvedDataSource.paginator = this.approvedPaginator;
    }
    if (this.approvedSort) {
      this.approvedDataSource.sort = this.approvedSort;
    }
  }

  /**
   * Carga todos los pagos y los filtra por estado
   */
  loadAllPayments(): void {
    this.isLoading = true;
    
    this.paymentsService.getAllPaymentsWithoutFilter().subscribe({
      next: (allPayments) => {
        // Filtramos los pagos por estado
        const pendingPayments = allPayments.filter(payment => 
          payment.status === 'PENDIENTE' || (!payment.status)
        );
        
        const approvedPayments = allPayments.filter(payment => 
          payment.status === 'PAGADO'
        );
        
        // Enriquecemos los pagos con datos de estudiantes y cursos
        this.enrichPaymentsWithData(allPayments);
        
        // Actualizamos los datos de las tablas
        this.pendingDataSource.data = pendingPayments;
        this.approvedDataSource.data = approvedPayments;
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando pagos:', error);
        this.isLoading = false;
        this.showMessage('Error al cargar los pagos. Por favor, intenta de nuevo.');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Enriquece los objetos de pago con datos de estudiante y curso
   */
  enrichPaymentsWithData(payments: any[]): void {
    payments.forEach(payment => {
      // Añadir datos del estudiante
      if (!payment.student) {
        payment.student = { 
          name: `Estudiante #${payment.student_id}`, 
          lastname: ''
        };
      }
      // Añadir datos de curso
      if (!payment.course) {
        if (payment.course_id) {
          if (this.courseCache[payment.course_id]) {
            payment.course = this.courseCache[payment.course_id];
          } else {
            this.coursesService.getCourseById(payment.course_id).subscribe({
              next: (courseData) => {
                if (courseData) {
                  this.courseCache[payment.course_id] = {
                    id: courseData.id,
                    name: courseData.title,
                    isActive: courseData.isActive,
                    price: courseData.price
                  };
                  payment.course = this.courseCache[payment.course_id];
                  this.cdr.detectChanges();
                }
              },
              error: (error) => {
                console.error(`Error cargando curso ID ${payment.course_id}:`, error);
                payment.course = { 
                  name: `Curso #${payment.course_id}`,
                  price: 0
                };
                this.cdr.detectChanges();
              }
            });
          }
        } else {
          payment.course = { 
            name: 'No disponible',
            price: 0
          };
        }
      }
    });
  }

  /**
   * Maneja el cambio de pestaña
   */
  onTabChange(event: any): void {
    this.activeDataSource = event.index === 0 ? this.pendingDataSource : this.approvedDataSource;
    this.cdr.detectChanges();
  }

  /**
   * Abre el diálogo para cambiar el estado de un pago
   */
  openStatusDialog(payment: any): void {
    const dialogRef = this.dialog.open(PaymentStatusDialogComponent, {
      width: '450px',
      data: { payment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePaymentStatus(payment, result);
      }
    });
  }

  /**
   * Actualiza el estado de un pago
   */
  updatePaymentStatus(payment: any, newStatus: string): void {
    this.isLoading = true;
    
    this.paymentsService.registerPayment(payment.student_id, payment.course_id).subscribe({
      next: () => {
        payment.status = newStatus;
        this.showMessage(`Estado de pago actualizado a: ${newStatus}`);
        
        // Actualizamos las tablas
        if (newStatus === 'PAGADO') {
          this.pendingDataSource.data = this.pendingDataSource.data.filter(p => p.id !== payment.id);
          this.approvedDataSource.data = [...this.approvedDataSource.data, payment];
        } else if (newStatus === 'PENDIENTE') {
          this.approvedDataSource.data = this.approvedDataSource.data.filter(p => p.id !== payment.id);
          this.pendingDataSource.data = [...this.pendingDataSource.data, payment];
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al actualizar el estado del pago:', error);
        this.showMessage('Error al actualizar el estado del pago');
        this.isLoading = false;
      }
    });
  }

  /**
   * Obtiene la fecha formateada
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Muestra un mensaje al usuario
   */
  showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
} 