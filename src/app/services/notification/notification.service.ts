import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Muestra un mensaje de éxito
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (por defecto 3000)
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
      panelClass: 'success-snackbar'
    });
  }

  /**
   * Muestra un mensaje de error
   * @param message Mensaje de error
   * @param duration Duración en ms (por defecto 5000)
   */
  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
      panelClass: 'error-snackbar'
    });
  }

  /**
   * Muestra un mensaje de información
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (por defecto 3000)
   */
  showInfo(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
      panelClass: 'info-snackbar'
    });
  }

  /**
   * Muestra un mensaje temporal sin acción
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (por defecto 2000)
   */
  showTemporary(message: string, duration: number = 2000): void {
    this.snackBar.open(message, '', {
      duration: duration
    });
  }
} 