import { Component, OnInit } from '@angular/core';
import { AuthModalComponent } from "../../../shared/components/auth-modal/auth-modal.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [AuthModalComponent],
  template: `
    <app-auth-modal
      [title]="title"
      [subtitle]="subtitle"
      [buttonText]="buttonText"
      [footerText]="footerText"
      [footerLink]="footerLink"
      [footerAction]="footerAction"
      [formFields]="recoveryFields"
      [showSocialButtons]="showSocialButtons"
      (formSubmit)="onFormSubmit($event)">
    </app-auth-modal>
  `
})
export class RecoverPasswordComponent implements OnInit {
  title = 'Restablecer contraseña';
  subtitle = 'Ingresa tu nueva contraseña';
  buttonText = 'Restablecer contraseña';
  footerText = '¿Recordaste tu contraseña?';
  footerAction = '/auth/login';
  footerLink = 'Iniciar sesión';
  showSocialButtons = false;
  oobCode: string | null = null;
  loading = false;
  mode: string | null = null;

  recoveryFields = [
    { 
      label: 'Nueva Contraseña', 
      controlName: 'newPassword', 
      type: 'password', 
      icon: 'key', 
      errorMessage: 'La contraseña debe tener al menos 6 caracteres'
    },
    { 
      label: 'Confirmar Contraseña', 
      controlName: 'confirmPassword', 
      type: 'password', 
      icon: 'key', 
      errorMessage: 'Las contraseñas deben coincidir'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'];
      this.mode = params['mode'];

      if (!this.oobCode || this.mode !== 'resetPassword') {
        this.snackBar.open('Link inválido o expirado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/auth/login']);
        return;
      }

      console.log('Código de restablecimiento:', this.oobCode);
      console.log('Modo:', this.mode);
    });
  }

  onFormSubmit(formData: any) {
    if (this.loading) return;
    
    console.log('Formulario recibido:', formData);
    
    // Validar que los campos existan
    if (!formData || !formData.newPassword || !formData.confirmPassword) {
      console.error('Faltan campos en el formulario:', formData);
      this.snackBar.open('Por favor completa todos los campos', 'Cerrar', { duration: 3000 });
      return;
    }

    const { newPassword, confirmPassword } = formData;
    
    // Validar longitud de contraseña
    if (!newPassword || newPassword.length < 6) {
      console.log('Contraseña muy corta:', newPassword?.length);
      this.snackBar.open('La contraseña debe tener al menos 6 caracteres', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      console.log('Contraseñas no coinciden:', { newPassword, confirmPassword });
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 });
      return;
    }

    // Validar código y modo
    if (!this.oobCode || this.mode !== 'resetPassword') {
      console.error('Código o modo inválido:', { oobCode: this.oobCode, mode: this.mode });
      this.snackBar.open('Link inválido o expirado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;
    console.log('Iniciando reseteo de contraseña...');
    console.log('Parámetros:', {
      oobCode: this.oobCode,
      mode: this.mode,
      newPassword: '***' // No mostrar la contraseña en logs
    });

    this.apiService.resetPassword(this.oobCode, newPassword)
      .pipe(finalize(() => {
        this.loading = false;
        console.log('Proceso de reseteo finalizado');
      }))
      .subscribe({
        next: () => {
          console.log('Contraseña actualizada exitosamente');
          this.snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Error detallado al resetear contraseña:', {
            error,
            code: error.code,
            message: error.message,
            fullError: JSON.stringify(error)
          });
          const message = error.message || 'Error al actualizar la contraseña';
          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
        }
      });
  }
}
