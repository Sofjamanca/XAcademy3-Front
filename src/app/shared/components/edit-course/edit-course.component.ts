import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { MatCardModule } from '@angular/material/card';
import { Course } from '../../../core/models/course.model';
import { CourseFormComponent } from '../course-form/course-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../../services/teacher/teacher.service';
import { response } from 'express';
@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CourseFormComponent, MatCardModule],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit{
  cursoExistente !: Course;
  cursoForm!: FormGroup;
  courseId: number | null = null;

  inputs = [
    { label: 'Titulo', atr: 'title', type: 'text', required: true },
    { label: 'Descripción', atr: 'description', type: 'textarea', required: true },
    {label:'Duración:',atr:'hours', options: [
      {label: '10 horas', value: 10}, 
      {label: '20 horas', value: 20}, 
      {label: '30 horas', value: 30}, 
      {label: '40 horas', value: 40}],  
    type: 'select', required:true},
    {label:'Categoría',atr:'category_id', options: [],  
      type: 'select', required:true},
      {label:'Profesor',atr:'teacher_id', options: [],  
        type: 'select', required:true},
      {label:'Modalidad',atr:'modalidad', options: [
        {label: 'Presencial', value: "PRESENCIAL"},
        {label: 'Virtual', value: "VIRTUAL"}, 
        {label: 'Híbrido', value: "HIBRIDO"}],  
    type: 'select', required:true},
    // {label:'Fecha inicio',atr:'startDate',  type: 'date'},
    //   {label:'Fecha fin',atr:'endDate', type: 'date'},
    {label:'Precio',atr:'price',  type: 'number', require:true},
    {label:'Cupo',atr:'quota',  type: 'number', required:true},
    {label:'Status',atr:'status',  options: [
      {label: 'Activo', value: "ACTIVO"},
      {label: 'Pendiente', value: "PENDIENTE"}, 
      {label: 'Finalizado', value: "FINALIZADO"}],  
      type: 'select', required:true},
    { label: 'fileInput', atr: 'image_url', type: 'media', required:false},
  ];

  constructor(
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService:CoursesService,
    private teacherService: TeacherService,
  ){
    // this.cursoForm = this.fb.group(
    //   this.inputs.reduce((acc, input) => {
    //     acc[input.atr] = [null, input.required ? Validators.required : []];
    //     return acc;
    //   }, {} as { [key: string]: any })
    // );
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params)=>{
      const id = params.get('id');
      this.courseId = id ? +id : null;
      console.log('id', this.courseId);
      if(this.courseId){
        this.cargarCurso();
      }else{
        console.error('ID del curso nu válido');
      }
    });
    this.cargarCurso();
    this.getTeachers();    
  }
  getCategories() {
    this.courseService.getCategories().subscribe({
      next: (categories) => {
        this.updateInput('category_id', 'options', categories.map(category => ({
          label: category.title, value: category.id
        })));
      },
      error: (error) => console.error('Error al obtener categorías:', error)
    });
  }
  
  getTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.updateInput('teacher_id', 'options', teachers.map(teacher => ({
          label: teacher.user.name, value: teacher.id
        })));
      },
      error: (error) => console.error('Error al obtener profesores:', error)
    });
  }
  
  //Método para actualizar los selects dinámicamente
  updateInput(atr: string, prop: string, value: any) {
    const inputFindIndex = this.inputs.findIndex(input => input.atr === atr);
    if (inputFindIndex !== -1) {
      this.inputs[inputFindIndex] = {
        ...this.inputs[inputFindIndex],
        [prop]: value
      };
    }
  }

  cargarCurso():void{
    if (!this.courseId) {
      console.error('No hay ID de curso para cargar.');
      return;
    }
  
    // Primero, obtenemos las categorías y profesores para que los select tengan opciones
    // this.getCategories();
    // this.getTeachers();
  
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (curso) => {
        if (!curso) {
          console.error('No se encontró el curso');
          return;
        }
  
        this.cursoExistente = curso;
        console.log('curso Existente',this.cursoExistente);

        this.cursoForm.patchValue({
          title: curso.title,
          description: curso.description,
          hours: curso.hours,
          category_id: curso.category_id,
          teacher_id: curso.teacher_id,
          modalidad: curso.modalidad,
          inicioDate: curso.startDate,
          finDate: curso.endDate,
          price: curso.price,
          status: curso.status,
          image_url: curso.image_url
        });
  
        console.log('Curso cargado:', curso);
      },
      error: (error) => console.error('Error al cargar el curso:', error)
    });
  }
  
  editarCurso(): void {
    console.log("Editando curso...");
  
    if (this.cursoForm.invalid) {
      console.log("Formulario inválido, revisa los campos", this.cursoForm.errors);
      return;
    }
    if (!this.cursoExistente) {
      console.error("Error: No se encontró el curso existente");
      return;
    }
  
    const datosActualizados = { ...this.cursoExistente, ...this.cursoForm.value };
    console.log("Datos actualizados:", datosActualizados); // Verifica que los datos sean correctos
  
    this.courseService.updateCourse(this.courseId!, datosActualizados).subscribe(
      () => {
        console.log("Curso actualizado con éxito");
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error("Error al actualizar el curso:", error);
      }
    );
  }

  
  

  goBack(): void {
    this.router.navigate(['/admin']);
  }
  
}
