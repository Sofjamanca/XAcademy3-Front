import { Component } from '@angular/core';
import { AuthModalComponent } from "../../../shared/components/auth-modal/auth-modal.component";

@Component({
  selector: 'app-register',
    standalone: true,
    imports: [AuthModalComponent],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  registerFields = [
    { label: 'Email', controlName: 'email', type: 'email', icon: 'mail', errorMessage: 'Please enter a valid email' },
    { label: 'Contraseña', controlName: 'password', type: 'password', icon: 'key', errorMessage: 'Please enter a valid password' },
    { label: 'Repetir contraseña', controlName: 'password1', type: 'password', icon: 'key', errorMessage: 'Please confirm your password' }
  ];
}

