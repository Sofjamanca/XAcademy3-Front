import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ModalService } from '../../../core/services/modal/modal.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CustomButtonComponent } from "../../../shared/components/custom-button/custom-button.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogContent,
    MatDialogActions,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule,
    CustomButtonComponent
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  imageUrl='img/364257859_998131068038033_4290420701209662657_n.jpg';
  iconUrl='img/logo_noc.png';
  iconSocialG='img/googlechrome_103832.webp';
  iconSocialF='img/facebook_logo_icon_147291.webp';
  iconSocialA='img/mac_os_application_apple_3783.webp';
  loginForm !: FormGroup;
 
 constructor(
  private router: Router, 
  private modalService: ModalService,
  private dialogRef: MatDialogRef<LoginComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) { }


ngOnInit(): void {
  this.loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password:new FormControl('', Validators.required)
  });
}

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Datos enviados:', this.loginForm.value);
      this.closeModal();
    }
  }
}
