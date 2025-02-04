import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { CustomButtonComponent } from "./shared/components/custom-button/custom-button.component";
import { ModalService } from './services/modal/modal.service';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { RecoverPasswordComponent } from './views/auth/recover-password/recover-password.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule, MatIconModule,
    CustomButtonComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'XAcademy3-Front';

  constructor(private modalService: ModalService){}


  openLogin() {
    this.modalService.openModal(LoginComponent, { title: 'Explora, Aprende, Crece' });
  }
  openRegister() {
    this.modalService.openModal(RegisterComponent, {title: 'Registrarse' });
  }

  openRecover() {
    this.modalService.openModal(RecoverPasswordComponent, {title: 'Recuperar contraseña' });
  }
}
