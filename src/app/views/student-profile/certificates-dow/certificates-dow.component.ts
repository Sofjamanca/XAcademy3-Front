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

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private certificadoService: CertificateService) { }

  ngOnInit(): void {
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
  }


  // Función para cargar los certificados
  cargarCertificados(): void {
    this.certificadoService.getCertificates(this.studentId).subscribe({
      next: (data) => {
        this.certificados = data;
      },
      error: (err) => {
        console.error('Error al cargar los certificados:', err);
      }
    });
  }

  descargarCertificado(studentId: number, courseId: number): void {
    this.certificadoService.generarCertificado(studentId, courseId).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        
        link.href = url;
        link.download = `Certificado_${studentId}_${courseId}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el certificado:', error);
        this.snackBar.open('No se pudo descargar el certificado', 'Cerrar', { duration: 3000 });
      }
    );
  }
  
  

}
