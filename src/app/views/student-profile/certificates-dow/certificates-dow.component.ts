import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../../services/certificates-dow/certificate.service';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { NgIf, NgFor, CommonModule } from '@angular/common';

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

  constructor( private route: ActivatedRoute, private certificadoService: CertificateService) { }

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

  // Función para generar un nuevo certificado
  generarCertificado(courseId: number): void {
    this.certificadoService.generarCertificado(this.studentId, courseId).subscribe({
      next: (data) => {
        console.log('Certificado generado:', data);
        this.cargarCertificados();  // Recargar los certificados
      },
      error: (err) => {
        console.error('Error al generar el certificado:', err);
      }
    });
  }

}
