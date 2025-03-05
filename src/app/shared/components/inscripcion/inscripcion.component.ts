import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../services/courses/courses.service';
import { Course, Category } from '../../../core/models/course.model';
import { CourseFormComponent } from '../course-form/course-form.component';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentService } from '../../../services/student/student.service';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CourseFormComponent, CommonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './inscripcion.component.html',
  styleUrl: './inscripcion.component.css'
})
export class InscripcionComponent implements OnInit {
  curso: Course | null = null;
  categoria!: Category;
  fields: any[] = [
    {label:'DNI', atr:'dni', type: 'number'},
    {label:'Telefono',atr:'phone', type: 'number'},
    {label:'Email', atr:'email', type: 'text'},
    {label:'Fecha de nacimiento',atr:'birthday',  type: 'date'},
    { label: 'Dirección', atr: 'address', type: 'text' }
  ];
  studentData: any = null;
  title: string ='';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private studentService: StudentService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    
    const userId = this.localStorageService.getItem('user_id');
    console.log(userId);
    this.studentData = this.studentService.getStudentData();

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

  onFormSubmit(formData: any) {
    if (!this.curso) return;

    const enrollmentData = {
      user_id: this.studentData?.user_id || formData.user_id,
      course_id: this.curso.id,
      birthday: this.studentData?.birthday || formData.birthday,
      dni: this.studentData?.dni || formData.dni,
      phone: this.studentData?.phone || formData.phone,
      address: this.studentData?.address || formData.address
  };
  this.studentService.enrollStudent(enrollmentData).subscribe(
    (response) => {
      console.log('Inscripción exitosa:', response);
      
    if (!this.studentData) {
        this.studentService.saveStudentData({
          user_id: formData.user_id,
          birthday: formData.birthday,
          dni: formData.dni,
          phone: formData.phone,
          address: formData.address
        });
      }

      this.router.navigate(['/perfil']);
    },
    (error) => {
      console.error('Error en la inscripción:', error);
    }
  );
}

  goHome(){
    this.router.navigate(['/home']);
  }
}
