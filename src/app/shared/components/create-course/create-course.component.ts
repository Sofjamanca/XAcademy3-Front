import { Component, inject, OnInit, signal } from '@angular/core';
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
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

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
  private readonly storage: Storage = inject(Storage);
  cursoForm!: FormGroup;
  duraciones = ['20 horas', '40 horas', '60 horas'];
  profesores: Teacher[] = [];
  modalidades = ['PRESENCIAL', 'VIRTUAL', 'HÍBRIDO'];
  categorias: any[] = [];
  imagenSeleccionada: boolean = false;
  minFechaFin: Date | null = null;
  
  // para almacenar el archivo y el preview
  imageFile: File | null = null;
  imagePreview: string | null = null;

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
        card: [null],
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


  onFileSelected1(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log("Archivo seleccionado:", file);
      this.imageFile = file;
      // genera la URL para el preview
      this.imagePreview = URL.createObjectURL(file);
      this.imagenSeleccionada = true;
      
      this.cursoForm.get('card')?.setValue(null);
    }
  }


  crearCurso() {
    if (this.cursoForm.valid) {
      if (this.imageFile) {
        // si hay imagen seleccionada, se sube primero
        this.uploadImage(this.imageFile)
          .then((downloadURL) => {
            // una vez subida la imagen, se asigna la URL al form control correspondiente.
            this.cursoForm.get('card')?.setValue(downloadURL);
            this.finalizarCreacionCurso();
          })
          .catch((error) => {
            console.error("Error en la carga de la imagen: ", error);
            this.openSnackBar("Error al subir la imagen", "Cerrar");
          });
      } else {
        // si no se seleccionó imagen, se crea el curso directamente.
        this.finalizarCreacionCurso();
      }
    }
  }


  private finalizarCreacionCurso() {
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
      updatedAt: '',
      image_url: formData.card
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


  uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `uploads/cursos/${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          if (snapshot.totalBytes !== 0) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Progreso de carga: ${progress}%`);
          }
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log('URL de la imagen:', downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => reject(error));
        }
      );
    });
  }

  irAHome() {
    this.router.navigate(['/home']);
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}

