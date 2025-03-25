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
  footerAction = '/auth/login';
  registerFields = [
    { label: 'Nombre', controlName: 'name', type: 'text', icon: '', errorMessage: 'Por favor ingrese un nombre válido' },
    { label: 'Apellido', controlName: 'lastname', type: 'tex', icon: '', errorMessage: 'Por favor ingrese un apellido válido' },
    { label: 'Email', controlName: 'email', type: 'email', icon: '', errorMessage: 'Por favor ingrese un email válido' },
    { label: 'Contraseña', controlName: 'password', type: 'password', icon: '', errorMessage: 'Por favor confirme su contraseña' }
  ];


  
}

