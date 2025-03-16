import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CoursesService } from '../../../services/courses/courses.service';
import { TeacherService } from '../../../services/teacher/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseFormComponent } from '../course-form/course-form.component';
import { MaterialModule } from '../../../material/material.module';
import { Router } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { start } from 'repl';


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
    MatNativeDateModule,
    CourseFormComponent, MaterialModule
  ], 
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent implements OnInit {
  @Input() tipo: 'crear' | 'editar' | 'inscribir' = 'crear';
  @Input() curso!: any;
  inputs: any[] = [];
  cursoForm: any;
  cursoExistente !: Course;
  cursoId!: number | 0;
 

  constructor(
    private coursesService: CoursesService,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCategories();
    this.getTeachers();

   

    const id = this.route.snapshot.paramMap.get('id');
    this.cursoId = id !== null ? +id : 0;
    console.log(this.cursoId);
    if (this.cursoId) {
      // Si hay ID, estamos en edición
      this.tipo = 'editar';
      console.log('el tipo es:',this.tipo);
      this.cargarCurso(this.cursoId);

    } else {
      // Si no hay ID, es un curso nuevo
      this.tipo = 'crear';
      console.log('el tipo es:',this.tipo);
    }

    this.inputs =   [
      {label:'Título',atr:'title', type: 'text'},
      {label:'Descripción', atr:'description', type: 'text'},
      {label:'Duración:',atr:'hours', options: [{label: '10 horas', value: 10}, {label: '20 horas', value: 20}, {label: '30 horas', value: 30}, {label: '40 horas', value: 40}],  type: 'select'},
      {label:'Categoría',atr:'category_id', options: [],  type: 'select'},
      {label:'Profesor',atr:'teacher_id', options: [],  type: 'select'},
      {label:'Modalidad',atr:'modalidad', options: 
        [{label: 'Presencial', value: "PRESENCIAL"},{label: 'Virtual', value: "VIRTUAL"}, {label: 'Híbrido', value: "HIBRIDO"}],  type: 'select'},
      {label:'Fecha inicio',atr:'startDate',  type: 'date', min:new Date()},
      {label:'Fecha fin',atr:'endDate', type: 'date', getMin:(data: any)=> data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]},
      {label:'Precio',atr:'price',  type: 'number'},
      {label:'Cupo',atr:'quota',  type: 'number'},
      {label:'Status',atr:'status',  options: [{label: 'Activo', value: "ACTIVO"},{label: 'Pendiente', value: "PENDIENTE"}, {label: 'Finalizado', value: "FINALIZADO"}],  type: 'select'},
      {atr:'image_url',  type: 'media', require: false},
    ];

    this.cdr.detectChanges(); 
  }

  
  private initForm() {
    this.cursoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      hours: ['', Validators.required],
      category_id: ['', Validators.required],
      teacher_id: ['', Validators.required],
      modalidad: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      price: ['', Validators.required],
      status: ['', Validators.required],
      image_url: ['']
    }); 
  }
  
  cargarCurso(id: number): void {
    if (!id) {
      console.error('No hay ID de curso para cargar.');
      this.crearCurso(0);
      return;
    }
  
    this.coursesService.getCourseById(id).subscribe({
      next: (curso) => {
        if (!curso) {
          console.error('No se encontró el curso');
          return;
        }
  
        this.cursoExistente = curso;
        console.log('Curso Existente', this.cursoExistente);
  
        
        //Aplicar valores al formulario
          this.cursoForm.patchValue({
            title: curso.title ?? '',
            description: curso.description ?? '',
            hours: curso.hours ?? '',
            category_id: curso.category_id ?? '',
            teacher_id: curso.teacher_id ?? '',
            modalidad: curso.modalidad ?? '',
            startDate: curso.startDate ?? '',
            endDate: curso.endDate ?? '',
            price: curso.price ?? '',
            quota: curso.quota ?? '',
            status: curso.status ?? '',
            image_url: curso.image_url ?? ''
          });
  
          console.log('Formulario actualizado:', this.cursoForm.value);
        
      },
      error: (error) => console.error('Error al cargar el curso:', error)
    });
  }
  
  getCategories() {
    console.log('Ejecutando getCategories...');
  this.coursesService.getCategories().subscribe({
    next: (categories) => {
      console.log('Categorías recibidas:', categories);
      this.updateInput('category_id', 'options', categories.map(category => ({ label: category.title, value: category.id })));
    },
    error: (error) => console.error('Error al obtener categorías:', error)
  });
  }
  
  getTeachers() {
    console.log('Ejecutando getCategories...');
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        console.log('Profesores recibidos:', teachers);
        this.updateInput('teacher_id','options',teachers.map((teacher)=>{ return {label:teacher.user.name, value: teacher.id }}));
      },
      error: (error) => console.error('Error al obtener profesores:', error)
    });
  }

  updateInput(atr: string,prop:string,value: any){
    const inputFindIndex = this.inputs.findIndex(input => input.atr === atr);
    this.inputs[inputFindIndex][prop] = value;
  }
  
  crearCurso(event: any) {
    console.log('Formulario enviado:', event);
  
    const curso: Course = {
      ...event
    };
  
    console.log('Curso a guardar:', curso);
  
    if (this.tipo === 'editar') {
      // Actualizar curso existente
          
      this.coursesService.updateCourse(this.cursoId, curso).subscribe({
        next: (response) => {
          console.log('Curso actualizado exitosamente:', response);
          this.snackBar.open('Curso actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.cdr.detectChanges(); 
          this.router.navigate(['/admin/cursos']);
        },
        error: (error) => {
          console.error('Error al actualizar curso:', error);
          this.snackBar.open('Error al actualizar el curso: ' + error.message, 'Cerrar', { duration: 3000 });
        }
      });
    } else if(this.tipo === 'crear'){
      console.log("entra aca");
      // Crear nuevo curso
      this.coursesService.addCourse(curso).subscribe({
        next: (response) => {
          console.log('Curso creado exitosamente:', response);
          this.snackBar.open('Curso creado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/admin/cursos']);
        },
        error: (error) => {
          console.error('Error al crear curso:', error);
          this.snackBar.open('Error al crear el curso: ' + error.message, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  goAdmin(){
    this.router.navigate(['/admin']);
  }
  
}
function recibirFormulario(form: any, FormGroup: any) {
  throw new Error('Function not implemented.');
}

