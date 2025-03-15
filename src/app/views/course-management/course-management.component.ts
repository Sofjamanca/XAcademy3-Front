import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses/courses.service';
import { Course } from '../../core/models/course.model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { Class } from '../../core/models/class.model';
import { ClassService } from '../../services/class/class.service';
import { AssistService } from '../../services/assist/assist.service';
import { CreateClassDialogComponent } from './create-class-dialog.component';
import { StudentService } from '../../services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PaymentsService } from '../../services/payments/payments.service';
import { PaymentDialogComponent } from './payment-dialog.component';
import { GradeDialogComponent } from './grade-dialog.component';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Assist } from '../../core/models/assist.model';
import { Student } from '../../core/models/student.model';
import { Inscription } from '../../core/models/inscription.model';
import { DateUtilsService } from '../../services/date-utils/date-utils.service';
import { NotificationService } from '../../services/notification/notification.service';
import { AttendanceManagementComponent } from './components/attendance-management/attendance-management.component';
import { PaymentManagementComponent } from './components/payment-management/payment-management.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatSlideToggleModule,
    AttendanceManagementComponent,
    PaymentManagementComponent,
    StudentManagementComponent
  ],
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  courseId: number | null = null;
  course: Course | null = null;
  students: Student[] = [];
  inscriptions: Inscription[] = [];
  loading: boolean = true;
  loadingStudents: boolean = false;
  error: string | null = null;
  selectedTabIndex: number = 0;
  
  // Datos para la tabla de pagos
  displayedPaymentColumns: string[] = ['name', 'email', 'amount', 'date', 'status', 'actions'];
  
  // Datos para la tabla de estudiantes
  displayedStudentColumns: string[] = ['name', 'email', 'condition', 'calification', 'actions'];
  
  // Fecha actual para el registro de asistencia
  currentDate: string = new Date().toISOString().split('T')[0];

  // Variables para la pestaña de asistencias
  classes: Class[] = [];
  loadingClasses: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private classService: ClassService,
    private assistService: AssistService,
    private studentService: StudentService,
    private paymentsService: PaymentsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dateUtils: DateUtilsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = parseInt(id);
        this.loadCourseDetails();
        this.loadStudentsFromInscriptions();
        this.loadClasses();
      } else {
        this.error = 'No se proporcionó ID del curso';
        this.loading = false;
      }
    });
  }

  loadCourseDetails(): void {
    if (!this.courseId) return;
    
    this.loading = true;
    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        // Asegurarse que hours tiene un valor válido
        if (!this.course.hours) {
          this.course.hours = 0;
        }
        this.loading = false;
        
        // Cargar la categoría después de obtener el curso
        if (this.course && this.course.category_id) {
          this.loadCategory();
        }
      },
      error: (error) => {
        console.error('Error al cargar detalles del curso', error);
        this.error = 'Error al cargar detalles del curso. Por favor, inténtelo de nuevo.';
        this.loading = false;
      }
    });
  }

  loadCategory(): void {
    if (this.course && this.course.category_id) {
      this.coursesService.getCategoryById(this.course.category_id).subscribe({
        next: (category) => { 
          if (category && this.course) {
            this.course.categoryTitle = category.title;
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error obteniendo la categoría:', err),
      });
    }
  }

  loadStudentsFromInscriptions(): void {
    if (!this.courseId) return;
    
    this.loadingStudents = true;
    
    this.studentService.getInscriptionsByCourse(this.courseId).subscribe({
      next: (inscriptions: Inscription[]) => {
        this.inscriptions = inscriptions;
        
        // Convertir las inscripciones a formato de estudiantes para el componente
        this.students = inscriptions.map(inscription => {
          const studentData = inscription.student;
          const userData = studentData.user;
          
          // Convertir la calificación a número si existe
          let qualification: number | undefined = undefined;
          if (studentData.qualification !== null && studentData.qualification !== undefined) {
            qualification = typeof studentData.qualification === 'string' 
              ? parseInt(studentData.qualification, 10) 
              : Number(studentData.qualification);
          }
          
          const student: Student = {
            id: studentData.id,
            name: `${userData.name} ${userData.lastname}`,
            email: userData.email,
            inscription_id: inscription.id,
            user_id: userData.dni,
            student_id: studentData.id,
            studentCondition: studentData.studentCondition,
            payment_status: studentData.payment_status,
            qualification: qualification,
            attendance: [],
            payments: []
          };
          
          // Cargar los pagos del estudiante
          this.cargarPagosDelEstudiante(student);
          
          // Cargar las asistencias del estudiante
          this.cargarAsistenciasDelEstudiante(student);
          
          return student;
        });
        
        this.loadingStudents = false;
      },
      error: (error: any) => {
        console.error('Error al cargar las inscripciones', error);
        this.loadingStudents = false;
        this.noStudentsFound();
      }
    });
  }
  
  noStudentsFound(): void {
    // Establecer un array vacío de estudiantes
    this.students = [];
    
    // Mostrar mensaje informativo
    this.snackBar.open('No hay estudiantes inscritos en este curso.', 'Cerrar', {
      duration: 5000,
      panelClass: 'info-snackbar'
    });
  }

  // Método para cargar los pagos de un estudiante
  cargarPagosDelEstudiante(student: Student): void {
    if (!student.student_id || !this.courseId) return;
    
    this.paymentsService.getAllPaymentsWithoutFilter().subscribe({
      next: (allPayments: any[]) => {
        // Filtrar pagos por estudiante y curso
        const pagosEstudiante = allPayments.filter(pago => 
          pago.student_id === student.student_id
        );
        
        const pagosCurso = pagosEstudiante.filter(pago => 
          pago.course_id === this.courseId || !pago.course_id
        );
        
        if (pagosCurso && pagosCurso.length > 0) {
          student.payments = pagosCurso.map((pago: any) => ({
            amount: pago.amount || 0,
            date: pago.date || new Date().toISOString().split('T')[0],
            status: pago.status || (student.payment_status === 'PENDIENTE' ? 'pending' : 'paid')
          }));
        } 
      },
      error: (error: any) => {
        console.error('Error al cargar pagos del estudiante:', student.name, error);
        // En caso de error, usar el valor por defecto para no romper ui
        student.payments = [{
          amount: this.course?.price || 5000,
          date: new Date().toISOString().split('T')[0],
          status: student.payment_status === 'PENDIENTE' ? 'pending' : 'paid'
        }];
      }
    });
  }

  // Método para cargar las asistencias de un estudiante
  cargarAsistenciasDelEstudiante(student: Student): void {
    if (!student.student_id) return;
    
    this.assistService.getAssistsByStudentId(student.student_id).subscribe({
      next: (asistencias: Assist[]) => {
        if (asistencias && asistencias.length > 0) {
          // Convertir las asistencias al formato esperado por el componente
          student.attendance = asistencias.map(asistencia => {
            // Determinar la fecha de la asistencia a partir de la clase
            let fecha = asistencia.created_at;
            let claseAsociada = null;
            
            if (asistencia.class_id) {
              // Buscar la fecha de la clase si está disponible
              claseAsociada = this.classes.find(c => c.id === asistencia.class_id);
              if (claseAsociada && claseAsociada.class_date) {
                fecha = claseAsociada.class_date;
              }
            }
            
            // Convertir el valor de attendance a booleano
            let isPresent = false;
            if (typeof asistencia.attendance === 'boolean') {
              isPresent = asistencia.attendance;
            } else if (typeof asistencia.attendance === 'number') {
              isPresent = asistencia.attendance === 1;
            } else if (typeof asistencia.attendance === 'string') {
              const attendanceStr = asistencia.attendance as string;
              isPresent = attendanceStr === '1' || attendanceStr.toLowerCase() === 'true';
            }
            
            // Normalizar la fecha para guardar en el formato correcto
            const fechaNormalizada = this.dateUtils.normalizeDate(fecha instanceof Date ? 
              fecha.toISOString() : String(fecha));
            
            return {
              present: isPresent,
              date: fechaNormalizada,
              classId: asistencia.class_id // Agregar el ID de la clase
            };
          });
        }
      },
      error: (error: any) => {
        console.error('Error al cargar asistencias del estudiante:', student.name, error);
        // En caso de error, el array de asistencias permanece vacío
      }
    });
  }

  loadClasses(): void {
    if (!this.courseId) return;
    
    this.loadingClasses = true;
    
    this.classService.getClassesByCourseId(this.courseId).subscribe({
      next: (response: any) => {
        // Procesar la respuesta según la estructura real que devuelve el backend
        if (Array.isArray(response) && response.length > 0 && response[0].clases) {
          // Si la respuesta es un array con un objeto que tiene una propiedad 'clases'
          this.classes = response[0].clases;
        } else if (Array.isArray(response)) {
          // Si la respuesta es directamente un array de clases
          this.classes = response;
        } else if (response && response.clases && Array.isArray(response.clases)) {
          // Si la respuesta es un objeto con una propiedad 'clases'
          this.classes = response.clases;
        } else if (response && typeof response === 'object') {
          // Si es un objeto único, convertirlo en array
          this.classes = [response];
        } else {
          console.error('Formato de respuesta no reconocido:', response);
          this.classes = [];
        }
        
        this.loadingClasses = false;
      },
      error: (error: any) => {
        console.error('Error cargando clases:', error);
        this.loadingClasses = false;
        this.classes = [];
      }
    });
  }

  registerPayment(student: Student): void {
    if (!student || !student.student_id || !this.courseId) {
      this.notificationService.showError('Faltan datos del estudiante o del curso');
      return;
    }
    
    if (student.payment_status === 'PAGADO') {
      this.notificationService.showInfo('Este estudiante ya ha realizado el pago');
      return;
    }

    // Abrir diálogo de confirmación
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '400px',
      data: {
        student: student,
        payment: {
          amount: this.course?.price || 0,
          status: student.payment_status
        },
        courseId: this.courseId
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.processPayment(student);
      }
    });
  }

  private processPayment(student: Student): void {
    if (!student.student_id || !this.courseId) return;
    
    this.paymentsService.registerPayment(student.student_id, this.courseId).subscribe({
      next: (response) => {
        // Actualizar el estado local del pago
        student.payment_status = 'PAGADO';
        
        this.notificationService.showSuccess('Pago registrado con éxito');
      },
      error: (error) => {
        console.error('Error al registrar el pago:', error);
        
        this.notificationService.showError(
          error.error?.message || 'Error al registrar el pago'
        );
      }
    });
  }

  // Método para abrir el diálogo de calificación
  gradeStudent(student: Student): void {
    if (!student || !student.student_id || !this.courseId) {
      this.notificationService.showError('No se puede calificar al estudiante. Faltan datos.');
      return;
    }

    const dialogRef = this.dialog.open(GradeDialogComponent, {
      width: '500px',
      data: {
        student: student,
        courseId: this.courseId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveStudentGrade(student, result);
      }
    });
  }

  // Método para guardar la calificación
  private saveStudentGrade(student: Student, gradeData: any): void {
    // Por ahora, simulamos la respuesta exitosa
    student.qualification = gradeData.qualification;
    student.studentCondition = gradeData.studentCondition;
    
    this.notificationService.showSuccess('Calificación guardada con éxito (simulado)');
  }

  goBack(): void {
    this.router.navigate(['/profesor']);
  }

  editCourseInfo(): void {
    if (this.courseId) {
      this.router.navigate(['/courses/edit', this.courseId]);
    }
  }

  createNewClass(): void {
    if (!this.courseId) return;

    const dialogRef = this.dialog.open(CreateClassDialogComponent, {
      width: '500px',
      data: { courseId: this.courseId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newClass: Class = {
          id: 0,
          topic: result.topic,
          class_date: result.class_date,
          course_id: this.courseId!,
          created_at: new Date(),
          updated_at: new Date()
        };

        this.classService.createClass(newClass).subscribe({
          next: (response: any) => {
            // Recargar las clases después de crear una nueva
            this.loadClasses();
          },
          error: (error: any) => {
            console.error('Error al crear la clase', error);
          }
        });
      }
    });
  }
} 