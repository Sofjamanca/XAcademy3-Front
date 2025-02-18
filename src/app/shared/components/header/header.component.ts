import { Component, inject, OnInit } from '@angular/core';
import { LogBtnComponent } from '../buttons/log-btn/log-btn.component';
import { RegisterBtnComponent } from '../buttons/register-btn/register-btn.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { MenuItem } from '../../../core/models/menu-item.model';
import { SearchInputComponent } from '../search-input/search-input.component';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal/modal.service';
import { LoginComponent } from '../../../views/auth/login/login.component';
import { RegisterComponent } from '../../../views/auth/register/register.component';
import { RecoverPasswordComponent } from '../../../views/auth/recover-password/recover-password.component';
import { MaterialModule } from '../../../material/material.module';
import { ApiService } from '../../../services/api.service';

import { AuthStateServiceService } from '../../../services/state/auth-state-service.service';
import { UserMenuComponent } from "./user-menu/user-menu.component";



@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    MaterialModule,
    RegisterBtnComponent,
    LogBtnComponent,
    HeaderMenuComponent,
    SearchInputComponent,
    CommonModule,
    UserMenuComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userName : string | null = null;
  apiService = inject(ApiService);
  authStateService = inject(AuthStateServiceService);

  constructor(private modalService: ModalService,
    
  ){  
    
  }
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userName');
    }
  }

  imgLogo: string = "/assets/images/logo.png";

  menuItems: MenuItem[] = [
    {text: "Inicio", route: "/home"},
    {text: "Cursos", route: "/courses"},
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
