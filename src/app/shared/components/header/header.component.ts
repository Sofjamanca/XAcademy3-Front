import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LogBtnComponent } from '../buttons/log-btn/log-btn.component';
import { RegisterBtnComponent } from '../buttons/register-btn/register-btn.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { MenuItem } from '../../../core/models/menu-item.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SearchInputComponent } from '../search-input/search-input.component';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal/modal.service';
import { LoginComponent } from '../../../views/auth/login/login.component';
import { RegisterComponent } from '../../../views/auth/register/register.component';
import { RecoverPasswordComponent } from '../../../views/auth/recover-password/recover-password.component';



@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    RegisterBtnComponent,
    LogBtnComponent,
    HeaderMenuComponent,
    MatFormFieldModule,
    SearchInputComponent,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private modalService: ModalService){}
  imgLogo: string = "/assets/images/logo.png";

  menuItems: MenuItem[] = [
    {text: "Inicio", route: ""},
    {text: "Cursos", route: ""},
    {text: "Nosotros", route: ""},
    {text: "Contacto", route: ""},
  ]

  menuOpen: boolean = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
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
