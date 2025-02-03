import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ApiService } from '../../../core/services/api.servi';
import { ModalService } from '../../../core/services/modal/modal.service';
import { LoginComponent } from '../../../views/auth/login/login.component';
import { RegisterComponent } from '../../../views/auth/register/register.component';


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
  @Input() showIcons : boolean = true;
  @Input() showIcon: boolean = true;
  @Input() showSocialButtons: boolean = true; 
  @Input() footerAction!: string;
 
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
    private dialogRef: MatDialogRef<AuthModalComponent>,
    private modalService: ModalService,
    private apiService: ApiService
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
        this.apiService.register(
          this.authForm.value.name,
          this.authForm.value.lastname,
          this.authForm.value.email,
          this.authForm.value.password

        ).subscribe({
          next: (response) => {
            console.log(response);
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = 'Error al registrarse';
            console.error(error);
          },
          complete: () => this.loading = false
        });
      }

      if (this.title === 'Iniciar Sesión') {
        this.apiService.login(
          this.authForm.value.email,
          this.authForm.value.password
        ).subscribe({
          next: (response) => {
            console.log('Login exitoso:', response);
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = 'Error al iniciar sesión';
            console.error(error);
          },
          complete: () => this.loading = false
        });
      }
    }
  }

  
  
}
