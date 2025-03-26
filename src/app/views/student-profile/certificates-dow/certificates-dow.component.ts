import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../../services/certificates-dow/certificate.service';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-certificates-dow',
  standalone: true,
  imports: [NgFor, NgIf, MaterialModule, CommonModule],
  templateUrl: './certificates-dow.component.html',
  styleUrl: './certificates-dow.component.css'
})
export class CertificatesDowComponent implements OnInit {
  certificados: any[] = [];
  studentId: number = 0;
  courseId: number = 0;
  loading: boolean = false;

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private certificadoService: CertificateService) { }

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCertificates();
  }
  loadCertificates(): void {
    this.loading = true;
    this.certificadoService.getCertificates(this.studentId).subscribe({
      next: (response: any) => {
        this.certificados = response.certificados || [];
        console.log('Certificados recibidos:', this.certificados); // Para depuración
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching certificates:', err);
        this.snackBar.open('Error al cargar certificados', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  handleCertificateAction(studentId: number, courseId: number): void {
    this.loading = true;
  
    // Llama al servicio para verificar si el certificado ya existe o debe generarse
    this.certificadoService.generateOrDownloadCertificate(studentId, courseId).subscribe({
      next: (response: Blob) => {
        // Descargar el archivo si ya está disponible
        this.downloadFile(response, studentId, courseId);
        this.loadCertificates(); // Recargar la lista para actualizar el estado
      },
      error: (err) => {
        console.error('Error:', err);
        let errorMessage = 'Error al procesar certificado';
        if (err.error?.message) {
          errorMessage = err.error.message;
        }
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
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

  checkAndGenerateCertificates(): void {
    if (!this.studentId || !this.courseId) {
      this.snackBar.open('Debe proporcionar un estudiante y un curso.', 'Cerrar', { duration: 5000 });
      return;
    }
  
    this.loading = true;
  
    this.certificadoService.checkAndGenerateCertificates(this.studentId, this.courseId).subscribe({
      next: (response: any) => {
        this.snackBar.open(response.message || 'Certificados generados correctamente', 'Cerrar', { duration: 5000 });
        this.loadCertificates(); // Actualiza la lista de certificados
      },
      error: (err) => {
        console.error('Error al generar certificados:', err);
        this.snackBar.open('Error al generar certificados', 'Cerrar', { duration: 5000 });
      },
      complete: () => (this.loading = false),
    });
  }
  
}
  
