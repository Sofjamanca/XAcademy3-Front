import { Component } from '@angular/core';
import { AuthModalComponent } from "../../../shared/components/auth-modal/auth-modal.component";
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthModalComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [ApiService]
})
export class ForgotPasswordComponent{
  forgotPasswordForm!: FormGroup;
  errorMessage: string = '';
  footerAction = 'auth/register';
  forgotPasswordFields = [
    { label: 'Email', controlName: 'email', type: 'email', icon: 'mail', errorMessage: 'Por favor ingrese un email válido' },
  ];


  constructor(private apiService: ApiService,
    private router: Router
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
    this.forgotPasswordForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.forgotPasswordForm.statusChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.forgotPasswordForm.controls['email'].valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  getErrorMessage(control: FormControl) {
    return control.hasError('required') ? 'Este campo es requerido' :
           control.hasError('email') ? 'Por favor ingrese un email válido' :
           '';
  }



  onSubmit() {
    if (this.forgotPasswordForm.valid) {    
      const email = this.forgotPasswordForm.value.email;
      this.apiService.forgotPassword(email).subscribe({
        next: (response) => {
          console.log('Respuesta forgotPassword:', response);
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Error forgotPassword:', error);
        }
      });
    }
  }
  onFooterLinkClick() {
    this.router.navigate(['/auth/login']);
  }
}
