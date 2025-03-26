import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../../services/certificates-dow/certificate.service';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../../services/courses/courses.service';

@Component({
  selector: 'app-certificates-dow',
  standalone: true,
  imports: [NgFor, NgIf, MaterialModule, CommonModule],
  templateUrl: './certificates-dow.component.html',
  styleUrl: './certificates-dow.component.css'
})
export class CertificatesDowComponent implements OnInit {
  certificados: any[] = [];
  courses: any[] = [];
  studentId: number = 0;
  courseId: number = 0;
  loading: boolean = false;
  courseStatus: { [key: number]: { canGenerate: boolean, message: string } } = {};

  constructor(
    private snackBar: MatSnackBar, 
    private route: ActivatedRoute, 
    private certificadoService: CertificateService,
    private courseService: CoursesService
  ) { }

  ngOnInit(): void {
    this.route.snapshot.paramMap.get('studentId');
    this.courseService.getCourseById(this.courseId) 
    this.loadStudentData();
  }
  loadStudentData(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.studentId) {
      this.certificadoService.getCertificates(this.studentId).subscribe(
        (data: any) => {  
          this.certificados = data?.certificados ?? []; 
        },
        (error) => {
          console.error('Error fetching certificates:', error);
        }
      );
    }
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe(
        (data: any) => {  
          this.courses = data?.course ?? []; 
        },
        (error) => {
          console.error('Error fetching cursos:', error);
        }
      );
    }
  }


  checkCoursesStatus(): void {
    this.courses.forEach(course => {
      this.courseService.getCourseById(course.id).subscribe({
        
        next: (validCourse) => {
          console.log(validCourse);
          this.certificadoService.checkCertificateRequirements(this.studentId, validCourse.id!).subscribe({
            next: (response: any) => {
              this.courseStatus[course.id] = {
                canGenerate: response.action === 'generate',
                message: response.message
              };
            },
            error: (err) => {
              this.courseStatus[course.id] = {
                canGenerate: false,
                message: err.error?.message || 'Error al verificar requisitos'
              };
            }
          });
        },
        error: () => {
          this.courseStatus[course.id] = {
            canGenerate: false,
            message: 'El curso no es válido'
          };
        }
      });
    });
    this.loading = false;
  }

  handleCertificateAction(courseId: number): void {
    this.loading = true;
    this.certificadoService.generateOrDownloadCertificate(this.studentId, courseId).subscribe({
      next: (response: Blob) => {
        this.downloadFile(response, this.studentId, courseId);
        this.loadStudentData(); // Recargar datos para actualizar estado
      },
      error: (err) => {
        console.error('Error:', err);
        this.showError(err.error?.message || 'Error al procesar certificado');
        this.loading = false;
      }
    });
  }

  checkCertificateRequirements(courseId?: number): void {
    this.loading = true;
    const targetCourseId = courseId || this.courseId;
    
    if (!targetCourseId) {
      this.showError('No se especificó un curso válido');
      this.loading = false;
      return;
    }
    this.certificadoService.checkCertificateRequirements(this.studentId, this.courseId).subscribe({
      
      next: (response: any) => {
        if (response.action === 'download') {
          this.snackBar.open('Certificado listo para descargar', 'Cerrar', { duration: 3000 });
          this.handleCertificateAction(this.courseId); // Descargar automáticamente
        } else {
          this.snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.showError(err.error?.message || 'No cumple los requisitos');
      },
      complete: () => this.loading = false
    });
  }

  private downloadFile(blob: Blob, studentId: number, courseId: number): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado_${studentId}_${courseId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
  
}
  
