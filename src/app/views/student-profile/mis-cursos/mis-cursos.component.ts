import { Component, OnInit} from '@angular/core';
import { StudentService } from '../../../services/student/student.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from '../../../shared/components/card/card.component';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [MaterialModule, CommonModule, MatCardModule, CardComponent],
  templateUrl: './mis-cursos.component.html',
  styleUrl: './mis-cursos.component.css'
})
export class MisCursosComponent implements OnInit{
  cursos: any[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.studentService.getInscriptionsByStudent().subscribe({
      next: (data) => {
        this.cursos = data.map((inscription: any) => inscription.course);
      },
      error: (err) => {
        console.error('Error al obtener cursos:', err);
      }
    });
  }
}
