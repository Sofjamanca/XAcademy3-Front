import { inject, Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Chart } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController, Title } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController, Title);
import { UserService } from '../../../services/user/user.service';
import { StudentService } from '../../../services/student/student.service';
import { PaymentsService } from '../../../services/payments/payments.service';
import { ClassService } from '../../../services/class/class.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Curso {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  modalidad: string;
  price: string;
  image_url: string;
  asistencia: {
    total: number;
    asistidas: number;
  };
  color?: string; 
}

export interface Inscripcion {
  id: number;
  course: Curso;  
  student_id: number;
  regirationDate: string;
  createdAt: string;
  updatedAt: string;
}


interface PagoPendiente {
  id: number;
  curso: string;
  monto: number;
  fechaVencimiento: Date;
  detalles: string;
}

@Component({
  selector: 'app-homestudent',
  standalone: true,
  imports: [FormsModule, FullCalendarModule, MaterialModule, CommonModule, NgFor, NgIf],
  templateUrl: './home.component.html',  
  styleUrls: ['./homestudent.component.css'] 
})
export class HomeStudentComponent implements OnInit {
  userService = inject(UserService);
  selectedCourseId: number = 0; 
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;
  nombreAlumno: string = '';
  student_Id: number = 0;

  dashboardCards = [
    { title: 'Cursos a los que te encuentras inscripto', value: '', icon: 'school', color: '#4CAF50' },
    { title: 'Pagos pendientes', value: '', icon: 'pending', color: '#2196F3' }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    events: [],
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    height: 'auto'
  };

  porcentajeAsistencia: number = 0;
  clasesAsistidas: number = 0;
  totalClases: number = 0;

  cursosInscritos: Curso[] = [];

  constructor(
    private studentService: StudentService,
    private paymentsService: PaymentsService,
    private classService: ClassService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.userName$.subscribe(userName => {});
    this.userService.getStudentId().subscribe((studentId) => {
      if (studentId) {
        this.student_Id = studentId;
        this.studentService.getInscriptionsByStudent().subscribe((inscripciones: Inscripcion[]) => {

        this.cursosInscritos = [];
        inscripciones.forEach((inscripcion: Inscripcion) => {
        const curso = inscripcion.course;  

        const cursoCompleto: Curso = {
        id: curso.id,
        title: curso.title,
        startDate: curso.startDate,
        endDate: curso.endDate,
        modalidad: curso.modalidad,
        price: curso.price,
        image_url: curso.image_url,
        asistencia: {
          total: 0,
          asistidas: 0
        }
      };

    this.cursosInscritos.push(cursoCompleto);

    if (this.cursosInscritos.length === 1) {
      this.selectedCourseId = cursoCompleto.id;
      this.cargarAsistencia();
    }
    });
    });

    this.classService.getCountTotalClass(studentId).subscribe((response) => {
      this.cargarEventosCalendario(response.clases); 
    });

    this.studentService.getInscriptionsCount().subscribe((data) => {
     this.dashboardCards[0].value = data.total.toString();
    });

    this.getPendingPayments(studentId);
  }
    }); 
  }

  
  cambiarCurso(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const cursoId = parseInt(selectedValue, 10);
  
    if (!isNaN(cursoId)) {
      this.selectedCourseId = cursoId;
      this.cargarAsistencia();  
    } else {
      console.error('El ID del curso seleccionado no es un número válido.');
    }
  }
  
  ngAfterViewInit(): void {
    if (this.totalClases > 0) {
      setTimeout(() => this.actualizarGraficoAsistencia(), 0);
    }
  }

  cargarAsistencia(): void {
    if (this.selectedCourseId > 0) {
      this.studentService.getAttendancePercentageByCourse(this.student_Id, this.selectedCourseId).subscribe((data) => {
  
        this.porcentajeAsistencia = parseFloat(data.percentage);
        this.clasesAsistidas = data.attended;
        this.totalClases = data.total;
        
        this.actualizarGraficoAsistencia();

        if (this.totalClases === 0) {
          this.clasesAsistidas = 0; 
          this.porcentajeAsistencia = 0;
          this.actualizarGraficoAsistencia(); 
      }
      }, error => {
        console.error('Error al obtener asistencia:', error);
      });
    }
  }

  actualizarGraficoAsistencia(): void {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) {
      console.error('El elemento canvas no está disponible');
      return;
    }
  
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D del canvas');
      return;
    }
  
    if (this.chart) {
      this.chart.destroy(); 
    }
  
    if (this.totalClases === 0) {
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Sin clases disponibles'],
          datasets: [{
            data: [1], 
            backgroundColor: ['#cccccc'], 
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: { display: true, position: 'bottom' },
            tooltip: {
              callbacks: {
                label: () => 'No hay clases disponibles'
              }
            }
          }
        }
      });
      return;
    }
 
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Asistidas', 'Ausentes'],
        datasets: [{
          data: [this.clasesAsistidas, this.totalClases - this.clasesAsistidas],
          backgroundColor: ['#4caf50', '#f44336'],
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw as number;
                const percentage = this.totalClases > 0 
                  ? ((value / this.totalClases) * 100).toFixed(1) 
                  : '0';
                return `${percentage}%`;
              }
            }
          },
        }
      }
    });
  }
  
  getPendingPayments(studentId: number): void {
    this.paymentsService.getTotalPendingPayments(studentId).subscribe(
      (response) => {
        this.dashboardCards[1].value = response.total.toString();
      },
      (error) => {
        console.error('Error al obtener pagos pendientes:', error);
      }
    );
  }

  private cargarEventosCalendario(clases: any[]): void {
    const events: EventInput[] = [];
    clases.forEach(clase => {
      const classDate = new Date(clase.class_date);
  
      const formattedDate = classDate.toISOString().split('T')[0];

      events.push({
        title: clase.topic,
        start: formattedDate,
        backgroundColor: this.getColorByCourse(clase.course_id),
        borderColor: this.getColorByCourse(clase.course_id),
      });
    });

    this.calendarOptions.events = events;
  }  
  
  
  private getColorByCourse(courseId: number): string {
    const hue = (courseId * 137) % 360; 
    return `hsl(${hue}, 70%, 50%)`; 
  }
  
  goAssist() {
    this.router.navigate(['/perfil/asistencias']); 
  }

}