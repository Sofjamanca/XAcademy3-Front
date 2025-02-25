import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesListComponent } from '../../../shared/components/courses-list/courses-list.component';
import { MaterialModule } from '../../../material/material.module';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { CategoriesComponent } from '../../../shared/components/categories/categories.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses/courses.service';
import { Course } from '../../../core/models/course.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, tap, filter, distinctUntilChanged, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'views-courses-page',
  standalone: true,
  imports: [
    CoursesListComponent,
    MaterialModule,
    FilterComponent,
    CategoriesComponent,
    PaginationComponent,
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css'
})

export class CoursesPageComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  searchTerm: string = '';
  isSearching: boolean = false;
  loading: boolean = true;
  private subscription: Subscription = new Subscription();
  
  constructor(
    private coursesSvc: CoursesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('Inicializando CoursesPageComponent');
    
    // Escuchar cambios en los parámetros de consulta usando queryParamMap
    this.subscription = this.route.queryParamMap.pipe(
      // Extraer el parámetro de búsqueda
      map(params => {
        const search = params.get('search');
        console.log('Parámetro de búsqueda extraído:', search);
        return search ? search.trim() : '';
      }),
      // Solo procesar cuando el término de búsqueda cambia
      distinctUntilChanged(),
      // Actualizar el estado de la búsqueda
      tap(searchTerm => {
        console.log('Término de búsqueda actualizado:', searchTerm);
        this.searchTerm = searchTerm;
        this.isSearching = !!searchTerm;
        this.loading = true;
      }),
      // Realizar la búsqueda o obtener todos los cursos
      switchMap(searchTerm => {
        if (searchTerm) {
          console.log(`Realizando búsqueda con término: "${searchTerm}"`);
          return this.coursesSvc.searchCourses(searchTerm);
        } else {
          console.log('Obteniendo todos los cursos');
          return this.coursesSvc.getCourses();
        }
      })
    ).subscribe({
      next: (courses) => {
        console.log('Cursos recibidos:', courses.length);
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener cursos:', error);
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
