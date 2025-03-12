import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses/courses.service';
import { Course } from '../../core/models/course.model';
import { FindPendingPaymentPipe } from './find-pending-payment.pipe';
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
import { FindClassPipe } from './find-class.pipe';
import { CreateClassDialogComponent } from './create-class-dialog.component';
import { StudentService } from '../../services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PaymentsService } from '../../services/payments/payments.service';
import { PaymentDialogComponent } from './payment-dialog.component';
import { GradeDialogComponent } from './grade-dialog.component';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Assist } from '../../core/models/assist.model';

interface User {
  name: string;
  lastname: string;
  dni: number;
  phone: string;
  birthday: string;
  address: string;
  email: string;
}

interface StudentData {
  id: number;
  user_id: number;
  course_id: number;
  qualification: string | null;
  studentCondition: string;
  payment_status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface Inscription {
  id: number;
  course_id: number;
  student_id: number;
  regirationDate: string;
  createdAt: string;
  updatedAt: string;
  student: StudentData;
}

interface Student {
  id: number;
  name: string;
  email: string;
  inscription_id?: number;
  user_id?: number;
  student_id?: number;
  studentCondition?: string;
  payment_status?: string;
  qualification?: string | number | null;
  attendance?: {
    present: boolean;
    date: string;
  }[];
  payments?: {
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'overdue';
  }[];
}

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FindPendingPaymentPipe,
    FindClassPipe,
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
    CreateClassDialogComponent,
    MatSlideToggleModule,
    PaymentDialogComponent,
    GradeDialogComponent
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
  
  // Datos para la tabla de asistencias
  displayedAttendanceColumns: string[] = ['name', 'email', 'present', 'actions'];
  
  // Datos para la tabla de pagos
  displayedPaymentColumns: string[] = ['name', 'email', 'amount', 'date', 'status', 'actions'];
  
  // Fecha actual para el registro de asistencia
  currentDate: string = new Date().toISOString().split('T')[0];

  // Variables para la pestaña de asistencias
  classes: Class[] = [];
  expandedClassId: number | null = null;
  loadingClasses: boolean = false;
  classFilterText: string = '';
  
  // Mapa para almacenar cambios temporales de asistencia
  pendingAttendanceChanges: Map<string, {student: Student, attendance: boolean}> = new Map();
  savingAttendance: boolean = false;
  
  get filteredClasses(): Class[] {
    // Si no hay clases, retornar un array vacío
    if (!this.classes || !Array.isArray(this.classes) || this.classes.length === 0) {
      console.log('No hay clases para filtrar');
      return [];
    }
    
    // Si no hay texto de filtro, devolver todas las clases
    if (!this.classFilterText || !this.classFilterText.trim()) {
      return this.classes;
    }
    
    const filterText = this.classFilterText.toLowerCase().trim();
    console.log('Filtrando clases con texto:', filterText);
    
    return this.classes.filter(c => {
      if (!c) return false;
      
      // Filtrar por tema (si existe)
      if (c.topic && typeof c.topic === 'string' && c.topic.toLowerCase().includes(filterText)) {
        return true;
      }
      
      // Filtrar por fecha
      try {
        const dateStr = this.formatDate(c.class_date || c.created_at);
        return dateStr.toLowerCase().includes(filterText);
      } catch (error) {
        console.error('Error al formatear fecha para filtrado:', error);
        return false;
      }
    });
  }

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
    private cdr: ChangeDetectorRef
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
          console.log('Categoría recibida:', category);
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
    console.log('Cargando inscripciones para el curso ID:', this.courseId);
    
    this.studentService.getInscriptionsByCourse(this.courseId).subscribe({
      next: (inscriptions: Inscription[]) => {
        console.log('Inscripciones recibidas:', inscriptions);
        this.inscriptions = inscriptions;
        
        // Convertir las inscripciones a formato de estudiantes para el componente
        this.students = inscriptions.map(inscription => {
          const studentData = inscription.student;
          const userData = studentData.user;
          
          const student = {
            id: studentData.id,
            name: `${userData.name} ${userData.lastname}`,
            email: userData.email,
            inscription_id: inscription.id,
            user_id: userData.dni,
            student_id: studentData.id,
            studentCondition: studentData.studentCondition,
            payment_status: studentData.payment_status,
            attendance: [],
            payments: []
          };
          
          // Cargar los pagos reales del estudiante
          this.cargarPagosDelEstudiante(student);
          
          // Cargar las asistencias del estudiante
          this.cargarAsistenciasDelEstudiante(student);
          
          return student;
        });
        
        this.loadingStudents = false;
        console.log('Estudiantes procesados:', this.students);
      },
      error: (error) => {
        console.error('Error al cargar las inscripciones', error);
        this.loadingStudents = false;
        
        // En lugar de cargar datos de ejemplo, mostrar un mensaje que no hay estudiantes
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
    
    // Usar el método existente en el servicio de pagos
    // El método acepta studentId y status como parámetros
    // carga primero todos los pagos independientemente del estado
    this.paymentsService.getPaymentsByStudent(student.student_id, 'ALL').subscribe({
      next: (response: any) => {
        // Filtrar pagos relacionados con este curso si es necesario
        const pagos = Array.isArray(response) ? response : [];
        const pagosCurso = pagos.filter((pago: any) => 
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
        // En caso de error, usar el valor por defecto
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
            // Determinar la fecha de la asistencia 
            let fecha = asistencia.created_at;
            if (asistencia.class_id) {
              // Buscar la fecha de la clase si está disponible
              const clase = this.classes.find(c => c.id === asistencia.class_id);
              if (clase && clase.class_date) {
                fecha = clase.class_date;
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
            
            return {
              present: isPresent,
              date: typeof fecha === 'string' ? fecha : new Date(fecha).toISOString().split('T')[0]
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
        
        // Si hay una clase expandida, cargar sus asistencias
        if (this.expandedClassId && this.expandedClassId > 0) {
          this.loadClassAttendances(this.expandedClassId);
        }
        
        console.log('Clases cargadas:', this.classes);
      },
      error: (error: any) => {
        console.error('Error cargando clases:', error);
        this.loadingClasses = false;
        this.classes = [];
      }
    });
  }

  toggleAttendance(student: Student, classId: number): void {
    if (!classId) {
      console.error('No se ha seleccionado ninguna clase');
      this.snackBar.open('No se ha seleccionado ninguna clase', 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    // Verificar que el estudiante tiene un ID válido
    if (!student.student_id) {
      console.error('El estudiante no tiene un ID válido', student);
      this.snackBar.open('Error al identificar al estudiante', 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    // Obtener el estado actual de asistencia y cambiarlo
    const currentStatus = this.getAttendanceStatus(student, this.currentDate);
    const newAttendanceStatus = !currentStatus;
    
    console.log(`Cambiando asistencia de ${student.name}: ${currentStatus ? 'PRESENTE' : 'AUSENTE'} -> ${newAttendanceStatus ? 'PRESENTE' : 'AUSENTE'}`);
    
    // Crear una clave única para identificar este cambio de asistencia
    const changeKey = `${classId}-${student.student_id}`;
    
    // Almacenar el cambio en el mapa de cambios pendientes
    this.pendingAttendanceChanges.set(changeKey, {
      student: student,
      attendance: newAttendanceStatus
    });
    
    // Actualizar la UI inmediatamente (sin enviar al servidor)
    if (!student.attendance) {
      student.attendance = [];
    }
    
    const normalizedCurrentDate = this.normalizeDate(this.currentDate);
    const existingIndex = student.attendance.findIndex(a => this.normalizeDate(a.date) === normalizedCurrentDate);
    
    if (existingIndex >= 0) {
      student.attendance[existingIndex].present = newAttendanceStatus;
    } else {
      student.attendance.push({
        present: newAttendanceStatus,
        date: normalizedCurrentDate
      });
    }
    
    // Forzar actualización del modelo
    setTimeout(() => {
      const finalStatus = this.getAttendanceStatus(student, this.currentDate);
      console.log(`Estado final de ${student.name}: ${finalStatus ? 'PRESENTE' : 'AUSENTE'}`);
    }, 0);
  }

  registerPayment(student: Student): void {
    if (!student || !student.student_id || !this.courseId) {
      this.snackBar.open('Faltan datos del estudiante o del curso', 'Cerrar', { 
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }
    
    if (student.payment_status === 'PAGADO') {
      this.snackBar.open('Este estudiante ya ha realizado el pago', 'Cerrar', { 
        duration: 3000 
      });
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
        
        this.snackBar.open('Pago registrado con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (error) => {
        console.error('Error al registrar el pago:', error);
        
        this.snackBar.open(
          error.error?.message || 'Error al registrar el pago', 
          'Cerrar', 
          {
            duration: 5000,
            panelClass: 'error-snackbar'
          }
        );
      }
    });
  }

  // Método para abrir el diálogo de calificación
  gradeStudent(student: Student): void {
    if (!student || !student.student_id || !this.courseId) {
      this.snackBar.open('No se puede calificar al estudiante. Faltan datos.', 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
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
    // metodo a implementar cuando este listo el backend:
    /*
    this.studentService.updateStudentGrade(gradeData).subscribe({
      next: (response) => {
        // Actualizar el estado local del estudiante
        student.qualification = gradeData.qualification;
        student.studentCondition = gradeData.studentCondition;
        
        this.snackBar.open('Calificación guardada con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (error) => {
        console.error('Error al guardar la calificación:', error);
        
        this.snackBar.open(
          error.error?.message || 'Error al guardar la calificación', 
          'Cerrar', 
          {
            duration: 5000,
            panelClass: 'error-snackbar'
          }
        );
      }
    });
    */
    
    // Por ahora, simulamos la respuesta exitosa
    student.qualification = gradeData.qualification;
    student.studentCondition = gradeData.studentCondition;
    
    this.snackBar.open('Calificación guardada con éxito (simulado)', 'Cerrar', {
      duration: 3000,
      panelClass: 'success-snackbar'
    });
    
    console.log('Datos de calificación que se enviarían al backend:', gradeData);
  }

  goBack(): void {
    this.router.navigate(['/teacher-profile']);
  }

  editCourseInfo(): void {
    if (this.courseId) {
      this.router.navigate(['/courses/edit', this.courseId]);
    }
  }

  getAttendanceStatus(student: Student, date: string): boolean {
    if (!student || !student.attendance || student.attendance.length === 0) {
      return false;
    }
    
    // Normalizar la fecha de búsqueda
    const normalizedDate = this.normalizeDate(date);
    
    // Buscar una entrada para esta fecha normalizada
    const record = student.attendance.find(a => this.normalizeDate(a.date) === normalizedDate);
    
    if (record) {
      // Imprimir para depuración
      console.log(`Estado de asistencia para ${student.name} en fecha ${normalizedDate}: ${record.present ? 'PRESENTE' : 'AUSENTE'}`);
    }
    
    return record ? record.present : false;
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
          id: 0, // El backend generará el ID
          topic: result.topic,
          class_date: result.class_date,
          course_id: this.courseId!,
          created_at: new Date(),
          updated_at: new Date()
        };

        this.classService.createClass(newClass).subscribe({
          next: (response: any) => {
            console.log('Clase creada correctamente', response);
            
            // Recargar las clases después de crear una nueva
            this.loadClasses();
            
            // Si la respuesta tiene la estructura esperada, actualizar el ID seleccionado
            const createdClass = response.class || response;
            if (createdClass && createdClass.id) {
              setTimeout(() => {
                this.expandedClassId = createdClass.id;
              }, 500);
            }
          },
          error: (error) => {
            console.error('Error al crear la clase', error);
          }
        });
      }
    });
  }

  toggleClassExpansion(classId: number): void {
    this.expandedClassId = this.expandedClassId === classId ? null : classId;
    
    // Si se está expandiendo una clase, cargar sus asistencias
    if (this.expandedClassId) {
      try {
        this.loadClassAttendances(this.expandedClassId);
      } catch (error) {
        console.error('Error al expandir la clase y cargar asistencias:', error);
        // No mostrar error al usuario aquí para no interrumpir la experiencia
      }
    }
  }

  loadClassAttendances(classId: number): void {
    if (this.students.length === 0) return;
    
    this.savingAttendance = true;
    
    try {
      this.assistService.getAssistsByClassId(classId).subscribe({
        next: (assists: Assist[]) => {
          if (!assists || assists.length === 0) {
            console.log('No hay asistencias registradas para esta clase');
            this.savingAttendance = false;
            return;
          }
          
          console.log('Asistencias recibidas:', assists);
          
          // Normalizar el formato de la fecha actual
          const normalizedCurrentDate = this.normalizeDate(this.currentDate);
          
          // Actualizar la información de asistencia para cada estudiante
          this.students.forEach(student => {
            if (!student.attendance) {
              student.attendance = [];
            }
            
            // Buscar la asistencia del estudiante para esta clase
            const studentAssist = assists.find(a => 
              a.student_id === student.student_id || 
              a.student_id === student.id
            );
            
            if (studentAssist) {
              // El valor attendance puede venir como booleano o como 1/0
              // Convertir a booleano para manejar ambos casos
              let isPresent = false;
              
              // Comprobar todos los posibles valores que indican asistencia positiva
              if (typeof studentAssist.attendance === 'boolean') {
                isPresent = studentAssist.attendance;
              } else if (typeof studentAssist.attendance === 'number') {
                isPresent = studentAssist.attendance === 1;
              } else if (typeof studentAssist.attendance === 'string') {
                const attendanceStr = studentAssist.attendance as string;
                isPresent = attendanceStr === '1' || attendanceStr.toLowerCase() === 'true';
              }
              
              console.log(`Estudiante ${student.name} (ID: ${student.student_id || student.id}):`, 
                        `Valor original attendance: ${studentAssist.attendance} (${typeof studentAssist.attendance})`, 
                        `Interpretado como: ${isPresent ? 'PRESENTE' : 'AUSENTE'}`);
              
              // Actualizar o agregar la asistencia para la fecha actual
              const existingIndex = student.attendance.findIndex(a => 
                this.normalizeDate(a.date) === normalizedCurrentDate
              );
              
              if (existingIndex >= 0) {
                student.attendance[existingIndex].present = isPresent;
              } else {
                student.attendance.push({
                  present: isPresent,
                  date: normalizedCurrentDate
                });
              }
            }
          });
          
          this.savingAttendance = false;
        },
        error: (error) => {
          console.error('Error al cargar asistencias:', error);
          this.savingAttendance = false;
          this.snackBar.open('Error al cargar asistencias', 'Cerrar', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      });
    } catch (error) {
      console.error('Error al intentar cargar asistencias:', error);
      this.savingAttendance = false;
      this.snackBar.open('No se pudieron cargar las asistencias', 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
    }
  }

  // Método para normalizar fechas al formato YYYY-MM-DD
  normalizeDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Retorna YYYY-MM-DD
    } catch (error) {
      console.error('Error normalizando fecha:', dateString, error);
      return dateString; // Si hay error, devolver la fecha original
    }
  }

  getClassDate(classObj: any): string {
    try {
      // Intentar obtener la fecha desde class_date o createdAt
      const date = classObj.class_date || classObj.createdAt;
      if (!date) return 'Fecha no disponible';
      
      // Formatear la fecha
      return new Date(date).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error('Error al formatear fecha de clase:', error);
      return 'Error en fecha';
    }
  }

  private formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    try {
      return dateObj.toLocaleDateString();
    } catch (error) {
      return '';
    }
  }

  // Nuevo método para guardar todos los cambios de asistencia
  saveAttendanceChanges(classId: number): void {
    if (this.pendingAttendanceChanges.size === 0) {
      this.snackBar.open('No hay cambios de asistencia para guardar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.savingAttendance = true;
    
    this.snackBar.open(`Guardando cambios de asistencia...`, '', {
      duration: 2000
    });

    // Obtener solo los cambios relevantes para esta clase
    const relevantChanges = Array.from(this.pendingAttendanceChanges.entries())
      .filter(([key]) => key.startsWith(`${classId}-`));
    
    if (relevantChanges.length === 0) {
      this.savingAttendance = false;
      this.snackBar.open('No hay cambios de asistencia para esta clase', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Crear un array de observables para cada cambio
    const requests = relevantChanges.map(([key, change]) => {
      const student = change.student;
      
      const assistData: Assist = {
        id: 0, // El backend ignorará este valor si el registro ya existe
        class_id: classId,
        student_id: student.student_id!,
        attendance: Boolean(change.attendance), // Asegurar que se envía como booleano
        created_at: new Date(),
        updated_at: new Date()
      };

      return this.assistService.registerAssist(assistData).pipe(
        catchError(error => {
          console.error('Error al registrar asistencia:', error);
          return of({ error: true, student: student.name });
        })
      );
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        // Contar éxitos y errores
        const errorCount = results.filter(r => r && (r as any).error).length;
        const savedCount = results.length - errorCount;
        
        // Eliminar los cambios guardados del mapa de pendientes
        relevantChanges.forEach(([key]) => {
          this.pendingAttendanceChanges.delete(key);
        });
        
        this.showSaveResults(savedCount, errorCount);
        
        // Recargar las asistencias para asegurar que la UI refleja el estado actual
        if (savedCount > 0) {
          setTimeout(() => this.loadClassAttendances(classId), 500);
        }
        
        this.savingAttendance = false;
      },
      error: (error) => {
        console.error('Error al procesar las asistencias', error);
        this.savingAttendance = false;
        this.snackBar.open('Error al guardar las asistencias', 'Cerrar', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  // Método para mostrar resultados del guardado
  private showSaveResults(saved: number, errors: number): void {
    if (errors === 0) {
      this.snackBar.open(`¡${saved} asistencias guardadas correctamente!`, 'Cerrar', {
        duration: 3000,
        panelClass: 'success-snackbar'
      });
    } else {
      this.snackBar.open(`Guardado con errores: ${saved} exitosas, ${errors} fallidas`, 'Cerrar', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    }
  }
} 