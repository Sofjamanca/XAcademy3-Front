import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../../services/courses/courses.service';
import { TeacherService } from '../../../services/teacher/teacher.service';
import { ApiService } from '../../../services/api.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Chart, registerables, ChartTypeRegistry } from 'chart.js';
import { StudentService } from '../../../services/student/student.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgxSkeletonLoaderModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loading: boolean = true;
  pendingRequests: number = 0;
  
  // Referencias a los elementos canvas para los gráficos
  @ViewChild('inscriptionChart') inscriptionChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  // Instancias de los gráficos
  inscriptionChart: Chart | null = null;
  categoryChart: Chart | null = null;
  
  // Estado de carga para cada gráfico
  loadingInscriptionChart: boolean = false;
  loadingCategoryChart: boolean = false;
  
  // Detección del tamaño de pantalla
  isMobile: boolean = false;
  windowWidth: number = 0;

  constructor(
    private coursesService: CoursesService,
    private teacherService: TeacherService,
    private apiService: ApiService,
    private studentService: StudentService
  ) {
    this.checkScreenSize();
  }
  
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    // Volver a renderizar los gráficos cuando cambia el tamaño de la pantalla
    if (this.inscriptionChart) {
      this.inscriptionChart.destroy();
      this.loadInscriptionChartData();
    }
    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.loadCategoriesChartData();
    }
  }
  
  checkScreenSize() {
    this.windowWidth = window.innerWidth;
    this.isMobile = window.innerWidth < 768;
  }

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

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadInscriptionChartData();
      this.loadCategoriesChartData();
    }, 500);
  }

  // Para verificar si se terminaron de cargar las solicitudes
  private checkLoading(): void {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }

  // Método para cargar los datos del gráfico de inscripciones por periodo
  loadInscriptionChartData(): void {
    // Indicar que el gráfico está cargando
    this.loadingInscriptionChart = true;
    
    // Obtener el año actual para filtrar los datos
    const currentYear = new Date().getFullYear();
    
    this.studentService.getMonthlyEnrollmentStats(currentYear).pipe(
    ).subscribe(data => {

      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const months = new Array(12).fill(0).map((_, i) => monthNames[i]);
      const enrollmentData = new Array(12).fill(0);
      
      data.forEach(item => {
        // Ajustar el índice del mes (la API devuelve 1-12, pero el array es 0-11)
        const monthIndex = item.month - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          enrollmentData[monthIndex] = item.count;
        }
      });
      
      // Renderizar el gráfico con los datos
      this.renderInscriptionChart(months, enrollmentData);
      this.loadingInscriptionChart = false;
    });
  }

  // Método para renderizar el gráfico de inscripciones
  renderInscriptionChart(labels: string[], data: number[]): void {
    if (!this.inscriptionChartCanvas) return;
    
    const ctx = this.inscriptionChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    if (this.inscriptionChart) {
      this.inscriptionChart.destroy();
    }
    
    const backgroundColors = data.map(value => {
      if (value > 20) return 'rgba(75, 192, 192, 0.8)'; 
      if (value > 10) return 'rgba(255, 205, 86, 0.8)'; 
      return 'rgba(255, 99, 132, 0.8)'; 
    });
    
    const fontSize = this.isMobile ? 10 : 12;
    const xAxisDisplay = !this.isMobile; 
    const legendDisplay = !this.isMobile; 
    
    this.inscriptionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Inscripciones del año actual',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Inscripciones',
              font: {
                size: fontSize
              }
            },
            ticks: {
              font: {
                size: fontSize
              }
            }
          },
          x: {
            title: {
              display: xAxisDisplay,
              text: 'Mes',
              font: {
                size: fontSize
              }
            },
            ticks: {
              font: {
                size: fontSize
              },
              callback: function(value, index) {
                if (window.innerWidth < 400) {
                  return index % 3 === 0 ? labels[index] : '';
                }
                return labels[index];
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                return `${value} inscripciones`;
              }
            },
            titleFont: {
              size: fontSize
            },
            bodyFont: {
              size: fontSize
            }
          },
          legend: {
            display: legendDisplay,
            position: 'top',
            labels: {
              font: {
                size: fontSize
              },
              boxWidth: this.isMobile ? 8 : 15
            }
          }
        }
      }
    });
  }

  loadCategoriesChartData(): void {
    this.loadingCategoryChart = true;
    
    this.coursesService.getCategories().pipe(
      catchError(error => {
        console.error('Error al obtener categorías:', error);
        this.loadingCategoryChart = false;
        return of([]);
      })
    ).subscribe(categories => {
      if (categories.length === 0) {
        console.warn('No se encontraron categorías para mostrar en el gráfico');
        this.loadingCategoryChart = false;
        return;
      }
      
      this.coursesService.getCourses().pipe(
        catchError(error => {
          console.error('Error al obtener cursos:', error);
          this.loadingCategoryChart = false;
          return of([]);
        })
      ).subscribe(courses => {
        const categoryCounts: { [key: string]: number } = {};
        const categoryColors: string[] = [];
        
        categories.forEach((category, index) => {
          categoryCounts[category.title] = 0;
          const hue = (index * 137) % 360;
          categoryColors.push(`hsl(${hue}, 70%, 65%)`);
        });
        
        courses.forEach(course => {
          const categoryId = course.category_id;
          if (categoryId) {
            const category = categories.find(c => c.id === categoryId);
            if (category) {
              categoryCounts[category.title] = (categoryCounts[category.title] || 0) + 1;
            }
          }
        });
        
        this.renderCategoryChart(Object.keys(categoryCounts), Object.values(categoryCounts), categoryColors);
        this.loadingCategoryChart = false;
      });
    });
  }

  // Método para renderizar el gráfico de categorías
  renderCategoryChart(labels: string[], data: number[], backgroundColor: string[]): void {
    if (!this.categoryChartCanvas) return;
    
    const ctx = this.categoryChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
    
    const fontSize = this.isMobile ? 10 : 12;
    
    const displayLabels = labels.map(label => {
      if (this.isMobile && label.length > 15) {
        return label.substring(0, 12) + '...';
      }
      return label;
    });
    
    this.categoryChart = new Chart(ctx, {
      type: 'pie' as keyof ChartTypeRegistry,
      data: {
        labels: displayLabels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColor,
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: this.isMobile ? 'bottom' : 'right',
            align: 'center',
            labels: {
              boxWidth: this.isMobile ? 10 : 15,
              padding: this.isMobile ? 8 : 15,
              font: {
                size: fontSize
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
                const percentage = Math.round((context.raw as number / total) * 100);
                return `${label}: ${value} cursos (${percentage}%)`;
              }
            },
            titleFont: {
              size: fontSize
            },
            bodyFont: {
              size: fontSize
            }
          }
        }
      }
    });
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
