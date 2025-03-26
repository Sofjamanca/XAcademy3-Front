import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student/student.service';
import { AssistService } from '../../../services/assist/assist.service';
import { Class } from '../../../core/models/class.model';
import { Assist } from '../../../core/models/assist.model';
import { ClassService } from '../../../services/class/class.service';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { CoursesService } from '../../../services/courses/courses.service';
import { UserService } from '../../../services/user/user.service';
import { Course } from '../../../core/models/course.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, catchError, of } from 'rxjs';

interface ClassAttendance {
  title: string;
  date: Date;
  attendanceStatus: string;
}

interface CourseAttendanceDetails {
  courseId: number;
  courseName: string;
  classes: ClassAttendance[];
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  condition: string;
}

@Component({
  selector: 'app-attendance-student',
  standalone: true,
  imports: [
    MatTableModule, 
    MaterialModule, 
    CommonModule,
    MatExpansionModule
  ],
  templateUrl: './attendance-student.component.html',
  styleUrl: './attendance-student.component.css'
})
export class AttendanceStudentComponent implements OnInit {
  studentId: number | null = null;
  coursesAttendanceDetails: CourseAttendanceDetails[] = [];
  displayedColumns: string[] = [
    'courseName', 
    'totalClasses', 
    'attendedClasses', 
    'attendancePercentage', 
    'condition'
  ];
  isLoading = true;
  approvedCoursesCount: number = 0; 

  constructor(
    private classService: ClassService,
    private coursesService: CoursesService,
    private assistService: AssistService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadStudentId();
  }

  loadStudentId(): void {
    this.userService.getStudentId().subscribe({
      next: (id) => {
        this.studentId = Number(id);
        if (this.studentId) {
          this.loadCourses();
        } else {
          this.isLoading = false;
          this.snackBar.open('No se pudo obtener el ID del estudiante', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al obtener el ID del estudiante', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadCourses(): void {
    this.studentService.getInscriptionsByStudent().subscribe({
      next: (inscriptions: any[]) => {
        if (inscriptions.length > 0) {
          const courseObservables = inscriptions.map(inscription => {
            const course = inscription.course;
            return this.loadCourseAttendanceDetails(Number(course.id), course.title);
          });

          forkJoin(courseObservables).subscribe({
            next: (results: CourseAttendanceDetails[]) => {
              this.coursesAttendanceDetails = results;
              this.approvedCoursesCount = this.coursesAttendanceDetails.filter(c => c.condition === 'Aprobado').length; // Aquí calculamos los cursos aprobados
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              this.snackBar.open('Error al obtener los detalles de asistencia', 'Cerrar', { duration: 3000 });
            }
          });
        } else {
          this.isLoading = false;
          this.snackBar.open('No se encontraron inscripciones para el estudiante', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al obtener los cursos', 'Cerrar', { duration: 3000 });
      }
    });
  }


  loadCourseAttendanceDetails(courseId: number, courseName: string) {
    return new Promise<CourseAttendanceDetails>((resolve, reject) => {
      this.classService.getClassesByCourseId(courseId).pipe(
        catchError(() => of({ clases: [] }))
      ).subscribe(response => {
        const courseClasses = response && 'clases' in response ? (response as any).clases : [];
        
        this.assistService.getAssistsByStudentId(this.studentId!).pipe(
          catchError(() => of([]))
        ).subscribe(attendanceRecords => {
          const classAttendances: ClassAttendance[] = courseClasses.map((classItem: Class) => ({
            title: classItem.topic || 'Clase sin nombre',
            date: classItem.class_date,
            attendanceStatus: this.getAttendanceStatus(courseId, classItem.id, attendanceRecords)
          }));

          const totalClasses = classAttendances.length;
          const attendedClasses = classAttendances.filter(ca => ca.attendanceStatus === 'Asistió').length;

          const attendancePercentage = totalClasses > 0 
            ? ((attendedClasses / totalClasses) * 100) 
            : 0;
          const condition = attendancePercentage >= 80 ? 'Aprobado' : 'No Aprobado';

          const courseAttendanceDetails: CourseAttendanceDetails = {
            courseId,
            courseName,
            classes: classAttendances,
            totalClasses,
            attendedClasses,
            attendancePercentage,
            condition
          };

          resolve(courseAttendanceDetails);
        }, error => reject(error));
      }, error => reject(error));
    });
  }

  getAttendanceStatus(courseId: number, classId: number, attendanceRecords: Assist[]): string {
    if (courseId === undefined || classId === undefined) {
      return 'Sin Asistencia';
    }
    const record = attendanceRecords.find(r => r.class_id === classId);
    return record ? (record.attendance ? 'Asistió' : 'No Asistió') : 'Sin Asistencia';
  }


  getAverageAttendancePercentage(): number {
    if (this.coursesAttendanceDetails.length === 0) {
      return 0; 
    }
  
    const totalPercentage = this.coursesAttendanceDetails.reduce((total, course) => {
      return total + (course.attendancePercentage || 0); 
    }, 0);
  
    return totalPercentage / this.coursesAttendanceDetails.length; 
  }
  
}