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

  inputs = [
    { label: 'Titulo', atr: 'title', type: 'text', required: true },
    { label: 'Descripción', atr: 'description', type: 'textarea', required: true },
    {label:'Duración:',atr:'hours', options: [{label: '10 horas', value: 10}, {label: '20 horas', value: 20}, {label: '30 horas', value: 30}, {label: '40 horas', value: 40}],  type: 'select', required:true},
    {label:'Categoría',atr:'category_id', options: [],  
      type: 'select', required:true},
      {label:'Profesor',atr:'teacher_id', options: [],  
        type: 'select', required:true},
      {label:'Modalidad',atr:'modalidad', options: [
        {label: 'Presencial', value: "PRESENCIAL"},
        {label: 'Virtual', value: "VIRTUAL"}, 
        {label: 'Híbrido', value: "HIBRIDO"}],  type: 'select', required:true},
    { label: 'Fecha de inicio', atr: 'startDate', type: 'date', required: true },
    { label: 'Fecha de fin', atr: 'endDate', type: 'date', required: true },
    {label:'Precio',atr:'price',  type: 'number', require:true},
    {label:'Cupo',atr:'quota',  type: 'number', required:true},
    {label:'Status',atr:'status',  options: [{label: 'Activo', value: "ACTIVO"},{label: 'Pendiente', value: "PENDIENTE"}, {label: 'Finalizado', value: "FINALIZADO"}],  type: 'select', required:true},
    { label: 'fileInput', atr: 'image_url', type: 'media', required:false},
  ];

  constructor(
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService:CoursesService,
    private teacherService: TeacherService,
  ){
    this.cursoForm = this.fb.group(
      this.inputs.reduce((acc, input) => {
        acc[input.atr] = [null, input.required ? Validators.required : []];
        return acc;
      }, {} as { [key: string]: any })
    );
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    
    // Cargar categorías y profesores antes de asignar valores al formulario
    this.courseService.getCategories().subscribe(categories => {
      this.inputs.find(input => input.atr === 'category_id')!.options = categories
        .filter(category => category.id !== undefined)
        .map(category => ({
          label: category.title,
          value: category.id as number
        }));
    });
  
    this.teacherService.getTeachers().subscribe(teachers => {
      this.inputs.find(input => input.atr === 'teacher_id')!.options = teachers.map(teacher => ({
        label: teacher.user.name,
        value: teacher.id
      }));
    });
  
    console.log('id del curso', courseId);
    if (courseId) {
      this.courseService.getCourseById(Number(courseId)).subscribe((course) => {
        this.cursoExistente = course;
        console.log('curso existente', this.cursoExistente);
        if (this.cursoExistente) {
          this.cursoForm.patchValue(this.cursoExistente); // Asegúrate de que esto se ejecute
        }
      });
    }
  }
  
  editarCurso(): void {
    console.log("Editando curso...");
  
    if (!this.cursoForm.valid) {
      console.log("Formulario inválido, revisa los campos", this.cursoForm.errors);
      return;
    }
  
    const datosActualizados = { ...this.cursoExistente, ...this.cursoForm.value };
    console.log("Datos actualizados:", datosActualizados); // Verifica que los datos sean correctos
  
    this.courseService.updateCourse(Number(this.cursoExistente.id), datosActualizados).subscribe(
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
