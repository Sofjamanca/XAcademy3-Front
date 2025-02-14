import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule,
    RouterModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent implements OnInit {
  cursoForm!: FormGroup;
  duraciones = ['20 horas', '40 horas', '60 horas'];
  profesores = ['Juan Chávez', 'María López', 'Carlos Pérez'];
  modalidades = ['Presencial', 'Virtual', 'Híbrido'];
  categorias = ['Tecnología', 'Negocios', 'Salud', 'Arte', 'Gastronomía'];
  imagenSeleccionada: boolean = false;
  minFechaFin: Date | null = null;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.cursoForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        duracion: ['', Validators.required],
        categoria: ['', Validators.required],
        profesor: ['', Validators.required],
        modalidad: ['', Validators.required],
        inicio: ['', Validators.required],
        fin: ['', Validators.required],
        precio: ['', [Validators.required, Validators.min(0)]],
        cupo: ['', [Validators.required, Validators.min(1)]],
        card: [null, Validators.required]
      },
      { validators: this.validarFechas }
    );
  }

  validarFechas(group: FormGroup) {
    const inicio = group.get('inicio')?.value;
    const fin = group.get('fin')?.value;

    if (inicio && fin && new Date(fin) < new Date(inicio)) {
      return { fechaInvalida: true };
    }
    return null;
  }

  actualizarMinFecha() {
    const inicio = this.cursoForm.get('inicio')?.value;
    this.minFechaFin = inicio ? new Date(inicio) : null;
  }

  crearCurso() {
    if (this.cursoForm.valid) {
      console.log('Curso creado:', this.cursoForm.value);
    }
  }

  onFileSelected(event: Event, tipo: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.cursoForm.get(tipo)?.setValue(file);
      this.cursoForm.get(tipo)?.updateValueAndValidity();
    }
  }


  onFileSelected1(event: any) {
  this.imagenSeleccionada = event.target.files.length > 0;
  }

  irAHome() {
    this.router.navigate(['/home']);
  }
}
