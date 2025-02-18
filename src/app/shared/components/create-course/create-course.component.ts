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
import { Course } from '../../../core/models/course.model';
import { CoursesService } from '../../../services/courses/courses.service';
import { TeacherService } from '../../../services/teacher/teacher.service';
import { Teacher } from '../../../core/models/teacher.model';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    MatIconModule, 
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule,
    RouterModule, 
    MatDatepickerModule, 
    MatNativeDateModule
  ],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent implements OnInit {
  cursoForm!: FormGroup;
  duraciones = ['20 horas', '40 horas', '60 horas'];
  profesores: Teacher[] = [];
  modalidades = ['PRESENCIAL', 'VIRTUAL', 'HÍBRIDO'];
  categorias: any[] = [];
  imagenSeleccionada: boolean = false;
  minFechaFin: Date | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private coursesService: CoursesService,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCategories();
    this.getTeachers();
  }

  private initForm(): void {
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
        card: [null]
      },
      { validators: this.validarFechas }
    );
  }

  getCategories() {
    this.coursesService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categorías recibidas:', categories);
        this.categorias = categories;
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }

  getTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        console.log('Profesores recibidos:', teachers);
        this.profesores = teachers;
      },
      error: (error) => {
        console.error('Error al obtener profesores:', error);
      }
    });
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
      const formData = this.cursoForm.value;
      
      const curso: Course = {
        title: formData.nombre,
        description: formData.descripcion,
        hours: parseInt(formData.duracion),
        price: formData.precio,
        quota: formData.cupo,
        startDate: formData.inicio,
        endDate: formData.fin,
        modalidad: formData.modalidad,
        teacher_id: Number(formData.profesor),
        category_id: Number(formData.categoria),
        status: 'ACTIVO',
        updatedAt: ''
      };
      
      console.log('Curso a crear:', curso);
      
      this.coursesService.addCourse(curso).subscribe({
        next: (response) => {
          console.log('Curso creado:', response);
          this.openSnackBar('Curso creado exitosamente', 'Cerrar');
          this.router.navigate(['/admin/cursos']);
        },
        error: (error) => {
          this.openSnackBar(`Error al crear el curso: ${error.message}`, 'Cerrar');
          console.error('Error al crear el curso:', error);
        }
      });
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

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }
  
}

