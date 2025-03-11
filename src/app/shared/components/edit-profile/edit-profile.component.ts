import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../../services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      birthday: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.apiService.getMe().subscribe({
      next: (data) => {
        if (data) {
          this.profileForm.patchValue({
            name: data.name,
            lastname: data.lastname,
            dni: data.dni,
            phone: data.phone,
            address: data.address,
            birthday: data.birthday
          });
        }
      },
      error: (error) => {
        console.error('Error obteniendo datos del usuario:', error);
        this.snackBar.open('Error al cargar los datos del perfil', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.apiService.updateUserProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/perfil']);
        },
        error: (error) => {
          console.error('Error completo:', error);
          this.snackBar.open(`Error al actualizar el perfil: ${error.message}`, 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/perfil']);
  }
}
