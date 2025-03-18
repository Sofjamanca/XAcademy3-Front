import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Confirmar Pago</h2>
    <mat-dialog-content>
      <div class="payment-info">
        <p><strong>Alumno:</strong> {{ data.student.name }}</p>
        <p><strong>Monto:</strong> {{ data.payment?.amount | currency }}</p>
        <p><strong>Estado actual:</strong> 
          <span class="status-badge" 
                [ngClass]="{
                  'status-pending': data.payment?.status === 'PENDIENTE',
                  'status-overdue': data.payment?.status === 'VENCIDO'
                }">
            {{ data.payment?.status === 'PENDIENTE' ? 'Pendiente' : 'Vencido' }}
          </span>
        </p>
      </div>
      <p class="confirmation-text">¿Confirmas que deseas registrar este pago como completado?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close *ngIf="!processing">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmPayment()" [disabled]="processing">
        <mat-icon *ngIf="!processing">paid</mat-icon>
        <mat-spinner *ngIf="processing" diameter="24"></mat-spinner>
        <span>{{ processing ? 'Procesando...' : 'Confirmar Pago' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .payment-info {
      margin-bottom: 20px;
    }
    .confirmation-text {
      margin-top: 20px;
      font-weight: 500;
    }
    .status-badge {
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-pending {
      background-color: #ff9800;
      color: white;
    }
    .status-overdue {
      background-color: #f44336;
      color: white;
    }
    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class PaymentDialogComponent {
  processing: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      student: any,
      payment: any,
      courseId: number
    }
  ) { }

  confirmPayment(): void {
    this.processing = true;
    // el componente padre se encargará de procesar el pago
    this.dialogRef.close(true);
  }
} 