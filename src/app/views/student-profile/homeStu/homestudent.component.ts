import { inject, Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { UserService } from '../../../services/user/user.service';

interface Curso {
  id: number;
  nombre: string;
  color: string;
  fechaInicio: Date;
  fechaFin: Date;
  diasClase: number[]; // 0-6 (domingo-sábado)
  asistencia: {
    total: number;
    asistidas: number;
  };
}

interface PagoPendiente {
  id: number;
  curso: string;
  monto: number;
  fechaVencimiento: Date;
  detalles: string;
}

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  tipo: 'clase' | 'examen' | 'taller';
  ubicacion: string;
  cursoId: number;
}
@Component({
  selector: 'app-homestudent',
  standalone: true,
  imports: [FullCalendarModule, MaterialModule, CommonModule, NgFor, NgIf],
  templateUrl: './home.component.html',  
  styleUrls: ['./homestudent.component.css'] 
})
export class HomeStudentComponent implements OnInit {
  userService = inject(UserService);
  @ViewChild('chartCanvas') chartCanvas: ElementRef<HTMLCanvasElement> | undefined;
  chart: Chart<'doughnut'> | undefined;
  // Datos del alumno
  nombreAlumno: string = '';
  totalCursosInscritos: number = 0;
  pagosPendientes: number = 0;
  proximasClases: number = 0;

  // Datos para el calendario
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    events: [],
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    height: 'auto'
  };

  // Datos para gráfico de asistencia
  cursoSeleccionado: number = 0;
  porcentajeAsistencia: number = 0;
  clasesAsistidas: number = 0;
  totalClases: number = 0;
  asistenciaChartData: ChartData<'doughnut'> = {
    labels: ['Asistidas', 'Ausentes'],
    datasets: [
      {
        data: [0, 0], // Datos iniciales que luego puedes actualizar dinámicamente
        backgroundColor: ['#4caf50', '#f44336']
      }
    ]
  };

  asistenciaChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };


  // Datos para tabla de pagos pendientes
  pagosPendientesList: PagoPendiente[] = [];
  displayedColumns: string[] = ['curso', 'monto', 'fechaVencimiento', 'acciones'];

  // Datos para actividades próximas
  proximasActividades: Actividad[] = [];

  // Datos de cursos del alumno
  cursosInscritos: Curso[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Cargar datos simulados (en un escenario real, estos datos vendrían de servicios)
    this.userService.userName$.subscribe(userName => {});
    this.cargarDatosCursos();
    this.cargarEventosCalendario();
    this.cargarPagosPendientes();
    this.cargarProximasActividades();
    this.actualizarGraficoAsistencia();
    // Inicializar datos de dashboard
    this.totalCursosInscritos = this.cursosInscritos.length;
    this.pagosPendientes = this.pagosPendientesList.length;
    this.proximasClases = this.contarProximasClases();

  }

  ngAfterViewInit(): void {
    // Verificar si el canvas existe y luego inicializar el gráfico
    if (this.chartCanvas?.nativeElement) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        // Crear el gráfico después de que el DOM esté listo
        this.chart = new Chart(ctx, {
          type: 'doughnut', // Tipo de gráfico
          data: this.asistenciaChartData, // Los datos del gráfico
          options: this.asistenciaChartOptions // Las opciones del gráfico
        });
      }
    }
  }

  actualizarGraficoAsistencia(): void {
    const cursoSeleccionado = this.cursosInscritos.find(curso => curso.id === this.cursoSeleccionado);
    
    if (cursoSeleccionado) {
      const { asistidas, total } = cursoSeleccionado.asistencia;
      const clasesAusentes = total - asistidas;

      this.asistenciaChartData = {
        labels: ['Asistidas', 'Ausentes'],
        datasets: [
          {
            data: [asistidas, clasesAusentes],
            backgroundColor: ['#4caf50', '#f44336']
          }
        ]
      };

      // Si el gráfico ya existe, actualizamos los datos
      if (this.chart) {
        this.chart.data = this.asistenciaChartData;
        this.chart.update();
      }
    }
  }

  // Métodos para acciones de pagos
  verDetallesPago(pago: PagoPendiente): void {
    // Aquí se mostraría un diálogo con los detalles del pago
    this.snackBar.open(`Detalles del pago: ${pago.detalles}`, 'Cerrar', {
      duration: 3000
    });
  }

  pagarCuota(pago: PagoPendiente): void {
    // Aquí se implementaría la lógica para redireccionar al pago
    this.snackBar.open(`Redirigiendo al portal de pagos para ${pago.curso}`, 'Entendido', {
      duration: 3000
    });
  }

  // Métodos para cargar datos (simulados)
  private cargarDatosCursos(): void {
    // Simulación de datos de cursos
    this.cursosInscritos = [
      {
        id: 1,
        nombre: 'Matemáticas Avanzadas',
        color: '#4caf50',
        fechaInicio: new Date(2025, 2, 10), // 10 de Marzo 2025
        fechaFin: new Date(2025, 6, 15),   // 15 de Julio 2025
        diasClase: [1, 3], // Lunes y Miércoles
        asistencia: {
          total: 12,
          asistidas: 10
        }
      },
      {
        id: 2,
        nombre: 'Física Cuántica',
        color: '#2196f3',
        fechaInicio: new Date(2025, 2, 15), // 15 de Marzo 2025
        fechaFin: new Date(2025, 6, 20),   // 20 de Julio 2025
        diasClase: [2, 4], // Martes y Jueves
        asistencia: {
          total: 10,
          asistidas: 8
        }
      },
      {
        id: 3,
        nombre: 'Programación Avanzada',
        color: '#9c27b0',
        fechaInicio: new Date(2025, 3, 5), // 5 de Abril 2025
        fechaFin: new Date(2025, 7, 10),  // 10 de Agosto 2025
        diasClase: [5], // Viernes
        asistencia: {
          total: 6,
          asistidas: 6
        }
      }
    ];
  }

  private cargarEventosCalendario(): void {
    const events: EventInput[] = [];
    
    // Generar eventos basados en los cursos inscritos
    this.cursosInscritos.forEach(curso => {
      const { fechaInicio, fechaFin, diasClase, nombre, color } = curso;
      
      // Generar fechas de clases entre la fecha de inicio y fin del curso
      let currentDate = new Date(fechaInicio);
      while (currentDate <= fechaFin) {
        // Si el día de la semana coincide con un día de clase del curso
        if (diasClase.includes(currentDate.getDay())) {
          events.push({
            title: nombre,
            start: new Date(currentDate),
            backgroundColor: color,
            borderColor: color
          });
        }
        
        // Avanzar al siguiente día
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    // Actualizar los eventos del calendario
    this.calendarOptions.events = events;
  }

  private cargarPagosPendientes(): void {
    // Simulación de datos de pagos pendientes
    this.pagosPendientesList = [
      {
        id: 1,
        curso: 'Matemáticas Avanzadas',
        monto: 150.00,
        fechaVencimiento: new Date(2025, 3, 5), // 5 de Abril 2025
        detalles: 'Cuota mensual de Abril 2025'
      },
      {
        id: 2,
        curso: 'Física Cuántica',
        monto: 180.00,
        fechaVencimiento: new Date(2025, 3, 10), // 10 de Abril 2025
        detalles: 'Cuota mensual de Abril 2025'
      }
    ];
  }

  private cargarProximasActividades(): void {
    // Simulación de próximas actividades
    const hoy = new Date();
    
    this.proximasActividades = [
      {
        id: 1,
        titulo: 'Clase de Ecuaciones Diferenciales',
        descripcion: 'Tema: Ecuaciones separables y homogéneas',
        fecha: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 2, 10, 0), // En 2 días a las 10:00
        tipo: 'clase',
        ubicacion: 'Aula 105',
        cursoId: 1
      },
      {
        id: 2,
        titulo: 'Examen Parcial',
        descripcion: 'Primer examen parcial de Física Cuántica',
        fecha: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 5, 14, 0), // En 5 días a las 14:00
        tipo: 'examen',
        ubicacion: 'Aula Magna',
        cursoId: 2
      },
      {
        id: 3,
        titulo: 'Taller de Programación',
        descripcion: 'Introducción a la programación orientada a objetos',
        fecha: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 3, 16, 0), // En 3 días a las 16:00
        tipo: 'taller',
        ubicacion: 'Laboratorio de Informática',
        cursoId: 3
      }
    ];
    
    // Ordenar actividades por fecha (más próximas primero)
    this.proximasActividades.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }

  private contarProximasClases(): number {
    // Contar cuántas actividades son clases
    return this.proximasActividades.filter(a => a.tipo === 'clase').length;
  }
}