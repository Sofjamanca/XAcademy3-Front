import { Component } from '@angular/core';
import { AuthModalComponent } from "../../../shared/components/auth-modal/auth-modal.component";

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [AuthModalComponent],
  templateUrl: './recover-password.component.html',
  styleUrl :'./recover-password.component.css'
})
export class RecoverPasswordComponent {
  footerAction = '/auth/login';

  recoveryFields = [
    { label: 'Email', controlName: 'email', type: 'email', icon: 'mail', errorMessage: 'Please enter a valid email' },
    { label: 'Contraseña', controlName: 'password', type: 'password', icon: 'key', errorMessage: 'Please enter a valid password' },
    { label: 'Nueva Contraseña', controlName: 'newpassword', type: 'password', icon: 'key', errorMessage: 'Please enter a valid password' }
  ];
}
