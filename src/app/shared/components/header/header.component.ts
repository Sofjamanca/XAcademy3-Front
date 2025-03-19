import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';
import { User } from 'firebase/auth';
import { UserService } from '../../../services/user/user.service';
import { StudentService } from '../../../services/student/student.service';


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
export class HeaderComponent implements OnInit {
  apiService = inject(ApiService);
  authStateService = inject(AuthStateServiceService);
  userService = inject(UserService);
  studentService = inject (StudentService);

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.authStateService.isAuthenticated$.subscribe(isAuthenticated => {
      // const studentData = this.apiService.getMe();
      // this.studentService.saveStudentData(studentData);
    });

    this.userService.userName$.subscribe(userName => {
    });
  }

  imgLogo: string = "/assets/images/logo.webp";

  menuItems: MenuItem[] = [
    {text: "Inicio", route: "/home"},
    {text: "Cursos", route: "/courses"},
    {text: "Nosotros", route: "/we"},
    {text: "Contacto", route: "/contact"},
    {text: "Créditos", route: "/credits"},
  ]
  activeMenuItem: string = 'Inicio';
  menuOpen: boolean = false;
  

 
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu():void{
    this.menuOpen = false;
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
