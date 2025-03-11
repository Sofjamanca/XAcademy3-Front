import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-homestudent',
  standalone: true,
  imports: [MaterialModule, CommonModule, NgFor, NgIf],
  templateUrl: './homestudent.component.html',  
  styleUrls: ['./homestudent.component.css'] 
})
export class HomeStudentComponent implements OnInit {
  totalCourses: number = 5;  
  totalCompletedCourses: number = 3;  
  totalPaymentsPending: number = 2;  
  upcomingExams: string[] = ['Examen de Matemáticas - 25 de marzo', 'Entrega de Proyecto de Física - 10 de abril']; 

  constructor() {}

  ngOnInit(): void {
    
  }
}
