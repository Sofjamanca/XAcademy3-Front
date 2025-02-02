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
  loginFields = [
    { label: 'Email', controlName: 'email', type: 'email', icon: 'mail', errorMessage: 'Please enter a valid email' },
    { label: 'Contraseña', controlName: 'password', type: 'password', icon: 'key', errorMessage: 'Please enter a valid password' }
  ];
}
