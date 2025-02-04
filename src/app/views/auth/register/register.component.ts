import { Component } from '@angular/core';
import { AuthModalComponent } from "../../../shared/components/auth-modal/auth-modal.component";
import { Route } from '@angular/router';

@Component({
  selector: 'app-register',
    standalone: true,
    imports: [AuthModalComponent],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  registerFields = [
    { label: 'Nombre', controlName: 'name', type: 'text', icon: '', errorMessage: 'Please enter a valid' },
    { label: 'Apellido', controlName: 'lastname', type: 'tex', icon: '', errorMessage: 'Please enter a valid password' },
    { label: 'Email', controlName: 'email', type: 'email', icon: '', errorMessage: 'Please enter a valid email' },
    { label: 'Contraseña', controlName: 'password', type: 'password', icon: '', errorMessage: 'Please confirm your password' }
  ];


  
}

