import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { Router, ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../services/courses/courses.service';

@Component({
  selector: 'shared-search-input',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>();
  
  searchQuery: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    // Verificar si ya hay un parámetro de búsqueda en la URL
    this.route.queryParamMap.subscribe(params => {
      const search = params.get('search');
      if (search) {
        console.log('Parámetro de búsqueda encontrado en URL:', search);
        this.searchQuery = search;
      }
    });
  }

  search() {
    if (this.searchQuery.trim()) {
      console.log('Realizando búsqueda con término:', this.searchQuery.trim());
      
      // Navegar a la página de cursos con el parámetro de búsqueda
      // y preservar otros parámetros que puedan existir
      this.router.navigate(['/courses'], { 
        queryParams: { search: this.searchQuery.trim() },
        queryParamsHandling: 'merge' // Fusionar con otros parámetros existentes
      });
      
      // Emitir el evento de búsqueda para componentes padres que puedan necesitarlo
      this.searchEvent.emit(this.searchQuery.trim());
    } else {
      // Si la búsqueda está vacía y estamos en la página de cursos, eliminar el parámetro de búsqueda
      if (this.router.url.includes('/courses')) {
        this.router.navigate(['/courses'], { 
          queryParams: { search: null },
          queryParamsHandling: 'merge'
        });
      }
    }
  }
}
