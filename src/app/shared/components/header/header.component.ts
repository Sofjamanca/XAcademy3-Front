import { Component } from '@angular/core';
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



@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    MaterialModule,
    RegisterBtnComponent,
    LogBtnComponent,
    HeaderMenuComponent,
    SearchInputComponent,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated = false;
  userName : string | null = null;

  constructor(private modalService: ModalService,
    private apiService: ApiService,
    private authStateService: AuthStateServiceService
  ){
    this.authStateService.checkAuthState(); // Verifica el estado de autenticación al cargar la página
    this.authStateService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      if(isAuth){
        this.userName = localStorage.getItem('userName');
      }else{
        this.userName = null;
      }
    });
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
  logout(): void {
    this.apiService.logout();
  }
  openRegister() {
    this.modalService.openModal(RegisterComponent, {title: 'Registrarse' });
  }

  openRecover() {
    this.modalService.openModal(RecoverPasswordComponent, {title: 'Recuperar contraseña' });
  }

}
