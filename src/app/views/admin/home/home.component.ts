import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CoursesService } from '../../../services/courses/courses.service';
import { TeacherService } from '../../../services/teacher/teacher.service';
import { ApiService } from '../../../services/api.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  loading: boolean = true;
  pendingRequests: number = 0;

  constructor(
    private coursesService: CoursesService,
    private teacherService: TeacherService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.pendingRequests = 4;

    this.coursesService.getCoursesCount().subscribe({
      next: (count) => {
        this.dashboardCards[0].value = count.toString();
        this.checkLoading();
      },
      error: () => this.checkLoading(),
    });

    this.teacherService.getTeachersCount().subscribe({
      next: (count) => {
        this.dashboardCards[1].value = count.toString();
        this.checkLoading();
      },
      error: () => this.checkLoading(),
    });

    this.apiService.getUsersCount().subscribe({
      next: (count) => {
        this.dashboardCards[2].value = count.toString();
        this.checkLoading();
      },
      error: () => this.checkLoading(),
    });

    this.coursesService.getCoursesCount().subscribe({
      next: (count) => {
        this.dashboardCards[3].value = count.toString();
        this.checkLoading();
      },
      error: () => this.checkLoading(),
    });
  }

  // Para verificar si se terminaron de cargar las solicitudes
  private checkLoading(): void {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }

  dashboardCards = [
    { title: 'Total Cursos', value: '', icon: 'school', color: '#4CAF50' },
    { title: 'Total Profesores', value: '', icon: 'people', color: '#2196F3' },
    { title: 'Total Usuarios', value: '', icon: 'group', color: '#FF9800' },
    {
      title: 'Cursos Activos',
      value: '',
      icon: 'play_circle',
      color: '#9C27B0',
    },
  ];
}
