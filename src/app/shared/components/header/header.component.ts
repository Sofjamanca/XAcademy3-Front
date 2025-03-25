import { Component, inject, OnInit, ChangeDetectorRef, Input, HostListener, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { LogBtnComponent } from '../buttons/log-btn/log-btn.component';
import { RegisterBtnComponent } from '../buttons/register-btn/register-btn.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ModalService } from '../../../services/modal/modal.service';
import { LoginComponent } from '../../../views/auth/login/login.component';
import { RegisterComponent } from '../../../views/auth/register/register.component';
import { RecoverPasswordComponent } from '../../../views/auth/recover-password/recover-password.component';
import { MaterialModule } from '../../../material/material.module';
import { ApiService } from '../../../services/api.service';
import { AuthStateServiceService } from '../../../services/state/auth-state-service.service';
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { UserService } from '../../../services/user/user.service';
import { StudentService } from '../../../services/student/student.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { debounceTime, fromEvent, Subscription } from 'rxjs';


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
  menu: any;
  apiService = inject(ApiService);
  authStateService = inject(AuthStateServiceService);
  studentService = inject (StudentService);
  userService = inject(UserService); 

  @ViewChild('userMenu') userMenu!: MatMenu;
  @ViewChild('mobileUserMenu') mobileUserMenu!: MatMenu;
  @ViewChild('userMenuTrigger', { static: false }) userMenuTrigger!: MatMenuTrigger;
  @ViewChild('mobileUserMenuTrigger', { static: false }) mobileUserMenuTrigger!: MatMenuTrigger;
  @ViewChild('mobileMenuTrigger') mobileMenuTrigger!: MatMenuTrigger;

  @Input() imgLogo: string = 'assets/images/logo.webp';
  menuOpen = false;
  isMobile = false;
  isTablet = false;
  isScrolled = false;

  private resizeSub!: Subscription;

  constructor(private modalService: ModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.authStateService.isAuthenticated$.subscribe(isAuthenticated => {
      // const studentData = this.apiService.getMe();
      // this.studentService.saveStudentData(studentData);
    });

    this.userService.userName$.subscribe(userName => {
    });

    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      this.setupResizeListener();
    }
  }
  private setupResizeListener(): void {
    this.resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Detección más precisa de tablets
      const isTabletSize = width > 768 && width <= 1024;
      const isTabletAspectRatio = Math.max(width, height) / Math.min(width, height) < 1.6;
      
      this.isMobile = width <= 768;
      this.isTablet = isTabletSize && isTabletAspectRatio;
    }
  }
  

  menuItems = [
    { text: 'Inicio', route: '/home', icon: 'home' },
    { text: 'Cursos', route: '/courses', icon: 'library_books' },
    { text: 'Nosotros', route: '/we', icon: 'groups' },
    {text:'Contacto', route: '/contact', icon: 'mail'},
    {text: 'Créditos', route: '/credits', icon: 'paid'},
  ];
  activeMenuItem: string = 'Inicio';
  // menuOpen: boolean = false;
  
  @HostListener('window:resize')
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }
  handleLogout() {
    if (this.isMobile && this.mobileMenuTrigger) {
      this.mobileMenuTrigger.closeMenu();
    }
    // Redirige o realiza otras acciones necesarias
  }
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;
    }
  }

  
  

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
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
