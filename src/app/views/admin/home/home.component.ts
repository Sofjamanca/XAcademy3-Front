import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CoursesService } from '../../../services/courses/courses.service';
import { TeacherService } from '../../../services/teacher/teacher.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private coursesService: CoursesService,
    private teacherService: TeacherService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.coursesService.getCoursesCount().subscribe((count) => {
      this.dashboardCards[0].value = count.toString();
    });

    this.teacherService.getTeachersCount().subscribe((count) => {
      this.dashboardCards[1].value = count.toString();
    });

    this.apiService.getUsersCount().subscribe((count) => {
      this.dashboardCards[2].value = count.toString();
    });

    this.coursesService.getCoursesCount().subscribe((count) => {
      this.dashboardCards[3].value = count.toString();
    });
  }

  dashboardCards = [
    { title: 'Total Cursos', value: '', icon: 'school', color: '#4CAF50' },
    { title: 'Total Profesores', value: '', icon: 'people', color: '#2196F3' },
    { title: 'Total Usuarios', value: '', icon: 'group', color: '#FF9800' },
    { title: 'Cursos Activos', value: '', icon: 'play_circle', color: '#9C27B0' }
  ];
}
