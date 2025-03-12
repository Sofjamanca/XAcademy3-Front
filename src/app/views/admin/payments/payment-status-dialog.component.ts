import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatChipsModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Cambiar Estado de Pago</h2>
    <mat-dialog-content>
      <div class="dialog-content">
        <div class="payment-details">
          <p class="detail-row">
            <mat-icon>person</mat-icon>
            <span class="detail-label">Estudiante:</span>
            <span class="detail-value">{{ data.payment.student?.name || 'N/A' }} {{ data.payment.student?.lastname || '' }}</span>
          </p>
          
          <p class="detail-row">
            <mat-icon>school</mat-icon>
            <span class="detail-label">Curso:</span>
            <span class="detail-value">{{ data.payment.course?.name || 'N/A' }}</span>
          </p>
          
          <p class="detail-row">
            <mat-icon>attach_money</mat-icon>
            <span class="detail-label">Monto:</span>
            <span class="detail-value">{{ data.payment.price | currency:'ARS':'symbol':'1.0-0' }}</span>
          </p>
          
          <p class="detail-row">
            <mat-icon>label</mat-icon>
            <span class="detail-label">Estado actual:</span>
            <span class="current-status">
              <span [ngClass]="getStatusClass(data.payment.status)">{{ getStatusText(data.payment.status) }}</span>
            </span>
          </p>
        </div>
        
        <div class="status-options">
          <h3>Selecciona el nuevo estado:</h3>
          <mat-radio-group [(ngModel)]="selectedStatus" class="status-radio-group">
            <mat-radio-button value="PENDIENTE" [disabled]="data.payment.status === 'PENDIENTE'">Pendiente</mat-radio-button>
            <mat-radio-button value="PAGADO" [disabled]="data.payment.status === 'PAGADO'">Pagado</mat-radio-button>
            <mat-radio-button value="RECHAZADO" [disabled]="data.payment.status === 'RECHAZADO'">Rechazado</mat-radio-button>
          </mat-radio-group>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button 
        mat-raised-button 
        color="primary" 
        [disabled]="!selectedStatus || selectedStatus === data.payment.status" 
        (click)="confirm()">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      padding: 15px 0;
    }
    .payment-details {
      margin-bottom: 25px;
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
    }
    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    .detail-label {
      font-weight: bold;
      margin-right: 10px;
      color: #555;
      min-width: 90px;
    }
    .detail-value {
      font-weight: 500;
      color: #333;
    }
    .current-status {
      font-weight: bold;
    }
    .status-pending {
      color: #ff9800;
    }
    .status-paid {
      color: #4caf50;
    }
    .status-rejected {
      color: #f44336;
    }
    h3 {
      margin-top: 0;
      color: #333;
      font-size: 16px;
    }
    .status-options {
      margin-top: 15px;
    }
    .status-radio-group {
      display: flex;
      flex-direction: column;
      margin: 15px 0;
    }
    mat-radio-button {
      margin: 5px 0;
    }
    mat-icon {
      margin-right: 10px;
      color: #3f51b5;
    }
  `]
})
export class PaymentStatusDialogComponent {
  selectedStatus: string = '';

  constructor(
    public dialogRef: MatDialogRef<PaymentStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { payment: any }
  ) {
    this.selectedStatus = data.payment.status;
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PAGADO': return 'status-paid';
      case 'PENDIENTE': return 'status-pending';
      case 'RECHAZADO': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PAGADO': return 'Pagado';
      case 'PENDIENTE': return 'Pendiente';
      case 'RECHAZADO': return 'Rechazado';
      default: return 'Pendiente';
    }
  }

  confirm(): void {
    this.dialogRef.close(this.selectedStatus);
  }
} 