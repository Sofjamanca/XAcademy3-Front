import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CustomButtonComponent } from '../custom-button/custom-button.component';


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
    @Input() showIcon:boolean = true;
  
    imageUrl = 'img/364257859_998131068038033_4290420701209662657_n.jpg';
    iconUrl = 'img/logo_noc.png';
    iconSocialG = 'img/googlechrome_103832.webp';
    iconSocialF = 'img/facebook_logo_icon_147291.webp';
    iconSocialA = 'img/mac_os_application_apple_3783.webp';
  
    authForm!: FormGroup;
  
    constructor(private dialogRef: MatDialogRef<AuthModalComponent>) { }
  
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
        console.log('Datos enviados:', this.authForm.value);
        this.closeModal();
      }
    }
}
