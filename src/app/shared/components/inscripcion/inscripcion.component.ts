import { Inject, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../services/courses/courses.service';
import { Course, Category } from '../../../core/models/course.model';
import { CourseFormComponent } from '../course-form/course-form.component';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentService } from '../../../services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { UserService } from '../../../services/user/user.service';

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
    {label:'Fecha de nacimiento',atr:'birthday',  type: 'date', max:new Date()},
    { label: 'Dirección', atr: 'address', type: 'text' }
  ];
  studentData: any = null;
  isEnrolled: boolean = false;
  course: any = {};
  category: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private coursesService: CoursesService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar, private apiService: ApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (!courseId) {
      return;
    }
  
    this.apiService.getMe().subscribe(
      data => {
        this.studentData = data;
        if (courseId && this.studentData) {
          this.checkEnrollmentStatus(courseId);
        }
      },
      error => {
        if (error?.error?.message !== 'Token no proporcionado') {
          this.snackBar.open('No se pudo obtener la información del estudiante.', 'Cerrar', { duration: 3000 });
        }     
       }
    );
  
    this.coursesService.getCourseById(courseId).subscribe(
      (courseData) => {
        this.curso = courseData;
  
        if (this.curso?.category_id) {
          this.coursesService.getCategoryById(this.curso.category_id).subscribe({
            next: (category) => this.category = category,
            error: () => {}         
           });
        }
      },
      () => {}
    );
  }
  

  checkEnrollmentStatus(courseId: number) {
    this.studentService.getInscriptionsByStudent().subscribe(
      (inscriptions) => {
        this.isEnrolled = inscriptions.some((inscription: any) => inscription.course_id === courseId);

        const hasValidData = this.studentData.dni &&
                             this.studentData.phone &&
                             this.studentData.birthday &&
                             this.studentData.address;
  
        if (!this.isEnrolled && hasValidData) {
          this.autoEnrollStudent(courseId);
        }
      },
      (error) => {
        console.error('Error al verificar inscripción:', error);
      }
    );
  }
  

  autoEnrollStudent(courseId: number) {
    if (!this.studentData) return;
  
    const enrollmentData = {
      user_id: this.studentData.user_id,
      course_id: courseId,
      birthday: this.studentData.birthday,
      dni: this.studentData.dni,
      phone: this.studentData.phone,
      address: this.studentData.address
    };

    this.studentService.enrollStudent(enrollmentData).subscribe(
      (response) => {
        this.isEnrolled = true;
        this.snackBar.open('Inscripción exitosa. Redirigiendo a tu panel...', 'Cerrar', { duration: 3000 });
        setTimeout(() => {
          this.router.navigate(['/perfil/mis-cursos']);
        }, 3000);
      },
      (error) => {
        console.error('Error en la inscripción automática:', error);
      }
    );
  }
  
  updateStudentData(formData: any): void {
    this.studentService.updateStudentData({
      dni: formData.dni,
      phone: formData.phone,
      birthday: formData.birthday,
      address: formData.address
    }).subscribe(
      (response) => {
        this.snackBar.open('Inscripción exitosa. Redirigiendo a tu panel...', 'Cerrar', { duration: 3000 });
        this.studentData = { ...this.studentData, ...formData };  
        this.userService.loadStudentId(); 
      },
      (error) => {
        console.error('Error al actualizar los datos:', error);
        this.snackBar.open('Error al actualizar los datos.', 'Cerrar', { duration: 3000 });
      }
    );
  }
  

  onFormSubmit(formData: any) {
    if (this.isEnrolled) {
      this.snackBar.open('Ya estás inscrito en este curso.', 'Cerrar', { duration: 3000 });
      return;
    }
    if (!this.curso) return;

    const enrollmentData = {
      user_id: this.studentData?.user_id || formData.user_id,
      course_id: this.curso.id,
      birthday: this.studentData?.birthday || formData.birthday,
      dni: this.studentData?.dni || formData.dni,
      phone: this.studentData?.phone || formData.phone,
      address: this.studentData?.address || formData.address
  };

  if (!this.studentData.dni || !this.studentData.phone || !this.studentData.birthday || !this.studentData.address) {
    this.updateStudentData(formData);
  }

  this.studentService.enrollStudent(enrollmentData).subscribe(
    (response) => {
      
    if (!this.studentData) {
        this.studentService.saveStudentData({
          user_id: formData.user_id,
          birthday: formData.birthday,
          dni: formData.dni,
          phone: formData.phone,
          address: formData.address
        });
      }
      this.userService.loadStudentId(); 
      this.router.navigate(['/perfil/mis-cursos']);
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
