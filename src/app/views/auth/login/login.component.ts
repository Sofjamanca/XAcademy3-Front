import { Component } from '@angular/core';
import { AuthModalComponent } from "../../../shared/components/auth-modal/auth-modal.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  footerAction = 'auth/register';
  loginFields = [
    { label: 'Email', controlName: 'email', type: 'email', icon: 'mail', errorMessage: 'Por favor ingrese un email válido' },
    { label: 'Contraseña', controlName: 'password', type: 'password', icon: 'key', errorMessage: 'Por favor ingrese una contraseña válida' }
  ];
  
  onFooterLinkClick() {
    console.log('ir a registro');
  }
}
