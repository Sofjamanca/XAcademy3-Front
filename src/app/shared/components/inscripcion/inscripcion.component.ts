import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../services/courses/courses.service';
import { Course, Category } from '../../../core/models/course.model';
import { CourseFormComponent } from '../course-form/course-form.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CourseFormComponent, CommonModule],
  templateUrl: './inscripcion.component.html',
  styleUrl: './inscripcion.component.css'
})
export class InscripcionComponent implements OnInit {
  curso: Course | null = null;
  categoria!: Category;
  fields: any[] = [
    {label:'Nombre',atr:'nombre', type: 'text'},
    {label:'DNI', atr:'dni', type: 'number'},
    {label:'Telefono',atr:'telefono', type: 'number'},
    {label:'Email', atr:'email', type: 'text'},
    {label:'Metodo de Pago',atr:'metodoPago', options: [{label: 'Efectivo'}, {label: 'Tarjeta de crédito'}, {label: 'Tarjeta de débito'}],  type: 'select'}
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.coursesService.getCourseById(courseId).subscribe((data) => {
        this.curso = data;

        if (this.curso.category_id) {
          this.coursesService.getCategoryById(this.curso.category_id).subscribe((cat: Category) => {
            this.categoria = cat;
          });
        }
      });
    }
  }

  onFormSubmit(event: any) {
    console.log('Formulario enviado:', event);
  }

  goHome(){
    this.router.navigate(['/home']);
  }
}
