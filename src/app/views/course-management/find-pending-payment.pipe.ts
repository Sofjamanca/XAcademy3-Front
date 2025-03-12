import { Pipe, PipeTransform } from '@angular/core';

interface Payment {
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

@Pipe({
  name: 'findPendingPayment',
  standalone: true
})
export class FindPendingPaymentPipe implements PipeTransform {
  transform(payments?: Payment[]): Payment | null {
    if (!payments || payments.length === 0) {
      return null;
    }

    // primero busca pagos pendientes
    const pendingPayment = payments.find(p => p.status === 'pending');
    if (pendingPayment) {
      return pendingPayment;
    }

    // si no hay pendientes, buscar vencidos
    const overduePayment = payments.find(p => p.status === 'overdue');
    if (overduePayment) {
      return overduePayment;
    }

    // si no hay ni pendientes ni vencidos, mostrar el último pago
    return payments[payments.length - 1];
  }
} 