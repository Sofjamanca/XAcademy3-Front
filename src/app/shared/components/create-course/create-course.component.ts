import { Component, Inject, OnInit, Input } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
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
  @Input() tipo: 'crear' | 'inscribir' = 'crear'; 
  @Input() curso!: any;
  inputs: any[] = [];

  constructor(
    private coursesService: CoursesService,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getTeachers();
    this.inputs =   [
      {label:'Título',atr:'title', type: 'text'},
      {label:'Descripción', atr:'description', type: 'text'},
      {label:'Duración:',atr:'hours', options: [{label: '10 horas', value: 10}, {label: '20 horas', value: 20}, {label: '30 horas', value: 30}, {label: '40 horas', value: 40}],  type: 'select'},
      {label:'Categoría',atr:'category_id', options: [],  type: 'select'},
      {label:'Profesor',atr:'teacher_id', options: [],  type: 'select'},
      {label:'Modalidad',atr:'modalidad', options: [{label: 'Presencial', value: "PRESENCIAL"},{label: 'Virtual', value: "VIRTUAL"}, {label: 'Híbrido', value: "HIBRIDO"}],  type: 'select'},
      {label:'Fecha inicio',atr:'startDate',  type: 'date'},
      {label:'Fecha fin',atr:'endDate', type: 'date'},
      {label:'Precio',atr:'price',  type: 'number'},
      {label:'Cupo',atr:'quota',  type: 'number'},
      {label:'Status',atr:'status',  options: [{label: 'Activo', value: "ACTIVO"},{label: 'Pendiente', value: "PENDIENTE"}, {label: 'Finalizado', value: "FINALIZADO"}],  type: 'select'},
      {atr:'image_url',  type: 'media', require: false},
    ];
  }

  getCategories() {
    this.coursesService.getCategories().subscribe({
      next: (categories) => {
        this.updateInput('category_id','options',categories.map((category)=>{ return {label:category.title, value: category.id }}));
      },
      error: (error) => console.error('Error al obtener categorías:', error)
    });
  }
  
  getTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.updateInput('teacher_id','options',teachers.map((teacher)=>{ return {label:teacher.user.name, value: teacher.user_id }}));
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
  
    console.log('Curso a crear:', curso);
  
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

  goAdmin(){
    this.router.navigate(['/admin']);
  }
  
}
