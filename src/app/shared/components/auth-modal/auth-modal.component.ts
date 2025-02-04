import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Route, Router, RouterModule } from '@angular/router';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ApiService } from '../../../services/api.service';
import { ModalService } from '../../../services/modal/modal.service';
import { LoginComponent } from '../../../views/auth/login/login.component';
import { RegisterComponent } from '../../../views/auth/register/register.component';
import { response } from 'express';
import { error } from 'console';


@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogContent,
    MatDialogActions,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule,
    CustomButtonComponent
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
  @Input() ruta !: string;

  @Output() backAction = new EventEmitter<void>();

  imageUrl = 'img/364257859_998131068038033_4290420701209662657_n.jpg';
  iconUrl = 'img/logo_noc.png';
  iconSocialG = 'img/googlechrome_103832.webp';
  iconSocialF = 'img/facebook_logo_icon_147291.webp';
  iconSocialA = 'img/mac_os_application_apple_3783.webp';

  authForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    @Optional() private dialogRef: MatDialogRef<AuthModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private modalService: ModalService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let formControls: any = {};
    this.formFields.forEach(field => {
      formControls[field.controlName] = new FormControl('', Validators.required);
    });
    this.authForm = new FormGroup(formControls);
  }

  closeModal() {
    this.dialogRef.close();
  }
  


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
        this.successfulManagement(response);
      },

      error: (error) => this.errorHandling('Error al iniciar sesión', error),
      complete: () => this.closeModal()
    });
  }

  private successfulManagement(response: any) {/*Mensaje de  exito*/
    console.log('Respuesta exitosa:', response);
    this.closeModal();
  }
  private errorHandling(errorMessage: string, error: any) {
    this.errorMessage = errorMessage;
    console.error(error);
  }

}
