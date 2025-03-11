import { Component, EventEmitter, input, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Course } from '../../../core/models/course.model';
import { Teacher } from '../../../core/models/teacher.model';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSnackBarModule, MatDatepickerModule, MatNativeDateModule,
    LoaderComponent
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit, OnChanges {
  @Input() inputs: any[] = [];
  @Input() tipo: 'crear' |'incribir'| 'editar' = 'crear';
  @Input() curso!: Course;
  @Input() profesores: Teacher[] = [];
  @Input() categorias: any[] = [];
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() title: string = '';
  @Output() formReady = new EventEmitter<FormGroup>();
  maxFechaNacimiento: string = new Date().toISOString().split('T')[0];
  cursoForm!: FormGroup;
  minFechaFin: Date | null = null;
  minFechaInicio: Date = new Date();
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.initForm();
    console.log('Curso en ngOnInit:', this.curso);

    // Si es un curso existente, cargar los valores
    if (this.curso) {
      this.cursoForm.patchValue({ ...this.curso });
    }

    this.cursoForm.get('startDate')?.valueChanges.subscribe((startDate: Date) => {
      this.minFechaFin = startDate;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['curso'] && this.curso) {
      console.log('Curso actualizado en ngOnChanges:', this.curso); // Verifica que el curso tenga datos
      this.cursoForm.patchValue({
        ...this.curso
      });
    

      // Si el curso tiene una imagen guardada, mostrarla
      if (!this.imageFile) {
        this.imagePreview = this.curso.image_url ?? null;
      }
    }
  }
  private validarFechas(form: FormGroup, tipo: 'crear' | 'incribir' | 'editar') {
    const inicio = form.get('startDate')?.value;
    const fin = form.get('endDate')?.value;
    const today = new Date();
  
    if (!inicio || !fin) return null; 
  
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
  
    
  
    if (tipo === 'crear') { 
      console.log(tipo);
      return finDate < inicioDate ? { fechaInvalida: true } : null;
    } else if (tipo === 'editar') {
      // Permitir fechas pasadas en inicio, pero la fecha de fin debe ser mayor o igual a la de inicio
      if (finDate < today) {
        return { fechaInvalida: true };
      }
    }
  
    return null; // Si pasa todas las validaciones, es válido
  }
  


  private initForm() {
    const group: any = {};

    this.inputs.forEach(input => {
      let validators = [];
      if (input.required !== false) {
        validators.push(Validators.required);
      }
  
      if (input.type === 'text' && input.atr === 'email') {
        validators.push(Validators.email);
      }
  
      if (input.type === 'number') {
        if (input.atr === 'dni') {
          validators.push(Validators.pattern(/^\d{7,8}$/));
        }
        if (input.atr === 'phone') {
          validators.push(Validators.pattern(/^\d{10}$/));
        }
      }
  
      if (input.type === 'date') {
        validators.push(Validators.required);
        if (input.atr === 'birthday') {
          validators.push(this.validateEdadNacimiento);
        }
      }
  
      // Cargar valores preexistentes en caso de edición
      group[input.atr] = new FormControl(
        this.curso ? (this.curso as any)[input.atr] : '', 
        { validators, updateOn: 'blur' }
      );
    });
  
    this.cursoForm = this.fb.group(group, { validators: (form: AbstractControl) => this.validarFechas(form as FormGroup, this.tipo) });
  }


  onSubmit(): void {
    if (this.cursoForm.valid) {
      this.isLoading = true;
      const formValues = { ...this.cursoForm.value };
  
      // Si se subió una imagen, guardarla en la propiedad correcta
      if (this.imageFile) {
        this.uploadImage(this.imageFile)
          .then(imageUrl => {
            formValues.imageUrl = imageUrl;
            this.emitFormEvent(formValues);
          })
          .catch(error => console.error("Error al subir la imagen:", error))
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        if (this.imagePreview) {
          formValues.imageUrl = this.imagePreview;
        }
        this.emitFormEvent(formValues);
        this.isLoading = false;
      }
    } else {
      console.log('Formulario inválido, revisar los campos', this.cursoForm.errors);
    }
  }
  // Nueva función para emitir el evento correcto
  private emitFormEvent(formValues: any) {
    if (this.tipo === 'editar' && this.curso) {
      formValues.id = this.curso.id; // Asegurar que conserve el ID
    }
    this.formSubmit.emit(formValues);
  }


  uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `uploads/cursos/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => console.log(`Progreso: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`),
        reject,
        () => getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject)
      );
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imagePreview = null;
  }

  onCancel(): void {
    this.cancel.emit();
  }



  private validateEdadNacimiento(control: AbstractControl): ValidationErrors | null {
    const fechaNacimiento = control.value;
    if (!fechaNacimiento) return null;

    const fechaHoy = new Date();
    const edad = fechaHoy.getFullYear() - new Date(fechaNacimiento).getFullYear();
    const mes = fechaHoy.getMonth() - new Date(fechaNacimiento).getMonth();

    if (edad < 18 || (edad === 18 && mes < 0)) {
      return { edadInvalida: true };
    }

    return null;
  }

}