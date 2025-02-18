import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ApiService } from '../../../services/api.service';
import { ModalService } from '../../../services/modal/modal.service';
import { LoginComponent } from '../../../views/auth/login/login.component';
import { RegisterComponent } from '../../../views/auth/register/register.component';

import { response } from 'express';
import { error } from 'console';
import { AuthStateServiceService } from '../../../services/state/auth-state-service.service';

// import { MaterialModule } from '../../../material/material.module';


@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule, MatInputModule, MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent,
    // MaterialModule
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AuthModalComponent implements OnInit {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() formFields!: { label: string, controlName: string, type: string, icon: string, errorMessage: string }[];
  @Input() buttonText!: string;
  @Input() footerText!: string;
  @Input() footerLink!: string;
  @Input() showIcons: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() showSocialButtons: boolean = true;
  @Input() footerAction!: string;

  @Output() footerLinClicked = new EventEmitter<void>();

  imageUrl = 'img/364257859_998131068038033_4290420701209662657_n.jpg';
  iconUrl = 'img/logo_noc.png';
  iconSocialG = 'img/googlechrome_103832.webp';
  iconSocialF = 'img/facebook_logo_icon_147291.webp';
  iconSocialA = 'img/mac_os_application_apple_3783.webp';

  authForm!: FormGroup;
  loading = false;
  errorMessage = '';

  isStandalone = false;
  route: any;

  constructor(
    @Optional() private dialogRef: MatDialogRef<AuthModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private modalService: ModalService,
    private apiService: ApiService,
    private router: Router,
    private authStateService: AuthStateServiceService,
    private ruta: ActivatedRoute
  ) { }

  ngOnInit(): void {                       
    let formControls: any = {};
    this.formFields.forEach(field => {
      formControls[field.controlName] = new FormControl('', Validators.required);
    });
    this.authForm = new FormGroup(formControls);


    // Detecta si la URL es directamente "/auth/login" o "/auth/register"
    this.isStandalone = this.ruta.snapshot.routeConfig?.path === 'auth/login' || 
                        this.ruta.snapshot.routeConfig?.path === 'auth/register' ||
                        this.ruta.snapshot.routeConfig?.path === 'auth/reset-password';

    
  }

  // Método para cerrar el modal
  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.modalService.closeModal();
    }
  }
  //Metodo para manejar el evento del footerLink
  onFooterLinkClicked() {
    this.footerLinClicked.emit();
    this.closeModal();
    this.router.navigate([this.footerAction]);
  }

  //enviar formulario
  onSubmit() {
    if (this.authForm.valid) {

      this.loading = true;
      this.errorMessage = '';

      if (this.title === 'Regístrate') {
        this.logManagement();
      } else if (this.title === 'Iniciar Sesión') {
        this.accessManagent();
      }
    }
  }

  private logManagement() { //registro
    const { name, lastname, email, password } = this.authForm.value;
    this.apiService.register(name, lastname, email, password).subscribe({
      next: (response) => this.successfulManagement(response),
      error: (error) => this.errorHandling('Error al registrarse', error),
      complete: () => this.loading = false
    });
  }

  private accessManagent() {//login
    const { email, password } = this.authForm.value;
    this.apiService.login(email, password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('role', response.user.role);
        this.successfulManagement(response);       
        this.authStateService.setAuthState(true);
      },
      error: (error) => this.errorHandling('Error al iniciar sesión', error)
    });
  }

  private successfulManagement(response: any) {
    console.log('Respuesta exitosa:', response);
    if (response.accessToken && response.refreshToken) {
      this.apiService.setTokens(response.accessToken, response.refreshToken);
      window.location.reload();
      this.router.navigate(['/']);
    }
    this.authForm.reset(); //limpiar formulario
    this.closeModal();
    if (this.title === 'Regístrate') {
      window.location.reload()
      this.router.navigate(['/']); // Redirige solo si el registro fue exitoso
      
    }
  }

  private errorHandling(errorMessage: string, error: any) {
    this.errorMessage = errorMessage;
    console.error('Error:', error);
    this.loading = false;
  }

}
