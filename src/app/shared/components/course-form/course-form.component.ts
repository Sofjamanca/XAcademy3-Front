import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
export class CourseFormComponent implements OnInit {
  @Input() inputs: any[] = []; 
  @Input() tipo: 'crear' | 'inscribir' = 'crear';
  @Input() curso?: Course;
  @Input() profesores: Teacher[] = [];
  @Input() categorias: any[] = [];
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @Input() title: string = '';
  cursoForm!: FormGroup;
  minFechaFin: Date | null = null;
  minFechaInicio: Date = new Date();
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isLoading: boolean =false;

  constructor(
    private fb: FormBuilder,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    console.log('Inputs recibidos:', this.inputs);
    this.initForm();

    this.cursoForm.get('startDate')?.valueChanges.subscribe((startDate: Date) => {
    this.minFechaFin = startDate; 
  });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['curso'] && this.curso) {
      this.cursoForm.patchValue({
        ...this.curso
      });
  
      // Si el curso tiene una imagen guardada, mostrarla
      if (!this.imageFile) {
        this.imagePreview = this.curso.image_url ?? null;
      }
    }
  }
  

  private validarFechas(form: FormGroup) {
    const inicio = form.get('startDate')?.value;
    const fin = form.get('endDate')?.value;
  
    if (!inicio || !fin) return null; 
  
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
  
    return finDate < inicioDate ? { fechaInvalida: true } : null;
  }
  
  
  private initForm() {
    const group: { [key: string]: any } = {}; 
  
    this.inputs.forEach(input => {
      const required = input.required === undefined ? true : input.required ;
      const value = input.type === 'media' ? [null] : ['', required ? Validators.required : null];
      group[input.atr] = value;
    });
  
    this.cursoForm = this.fb.group(group, { validators: this.validarFechas });
  
    this.cursoForm.get('startDate')?.valueChanges.subscribe((inicio) => {
      this.minFechaFin = inicio ? new Date(inicio) : null;
    });
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      this.isLoading =true
      const formValues = this.cursoForm.value;
  
      if (this.imageFile) {
        this.uploadImage(this.imageFile)
        .then((imageUrl) => {
          const inputIndex = this.inputs.findIndex((input) => input.type === 'media');
          if (inputIndex !== -1) {
            formValues[this.inputs[inputIndex].atr] = imageUrl;
          }
          this.formSubmit.emit(formValues);
        })
        .catch((error) => console.error("Error al subir la imagen:", error))
        .finally(() => {
          this.isLoading = false; // ✅ Ocultar loader después del proceso
        });
      } else {
         // Si no hay imagen y el campo es obligatorio, no se debe emitir el formulario
      const mediaInputIndex = this.inputs.findIndex(input => input.type === 'media');
      if (mediaInputIndex !== -1 && this.inputs[mediaInputIndex].required && !this.imagePreview) {
        console.log("La imagen es obligatoria.");
        this.isLoading = false; // Asegúrate de ocultar el loader
        return; // Salir si la imagen es obligatoria y no se ha proporcionado
      }

      // Emitir el formulario si la imagen no es obligatoria o ya hay una imagen previa
      this.formSubmit.emit(formValues);
      this.isLoading = false;
      }
    } else {
      console.log("Formulario inválido, revisa los campos", this.cursoForm.errors);
    }
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(this.imageFile);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imagePreview = null;
    
    this.cursoForm.patchValue({
      imageUrl: null
    });

    event?.stopPropagation();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}