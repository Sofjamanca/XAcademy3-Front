import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CoursesListComponent } from '../../../shared/components/courses-list/courses-list.component';
import { MaterialModule } from '../../../material/material.module';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { CategoriesComponent } from '../../../shared/components/categories/categories.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses/courses.service';
import { Category, Course } from '../../../core/models/course.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LayoutModule } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';

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
    MatIconModule,
    LayoutModule,
  ],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css',
})
export class CoursesPageComponent implements OnInit {
  @ViewChild('filterModal') filterModal!: TemplateRef<any>;

  courses: Course[] = [];
  categories: Category[] = [];
  selectedCategories: number[] = [];
  selectedPrice: string = '';
  selectedOrder: string = '';
  searchTerm: string = '';
  isSearching: boolean = false;
  loading: boolean = true;
  showFilters: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  isMobile: boolean = false;

  constructor(
    private coursesSvc: CoursesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  ngOnInit() {
    this.loading = true;
    // Verificar si hay un parámetro de búsqueda
    this.route.queryParamMap.subscribe((params) => {
      const search = params.get('search');
      this.searchTerm = search ? search.trim() : '';
      this.isSearching = !!this.searchTerm;

      if (this.isSearching) {
        this.searchCourses();
      } else {
        this.loadCourses();
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  toggleFilters(): void {
    if (window.innerWidth <= 768) {
      this.openFilterModal();
    } else {
      this.showFilters = !this.showFilters;
    }
  }

  openFilterModal(): void {
    document.querySelector('.container')?.classList.add('blur-background');

    const dialogRef = this.dialog.open(this.filterModal, {
      width: '90%',
      maxWidth: '400px',
      maxHeight: '90vh',
      panelClass: ['scrollable-modal', 'filter-modal'],
      backdropClass: 'filter-modal-overlay',
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      document.querySelector('.container')?.classList.remove('blur-background');
    });
  }

  closeFilterModal(): void {
    document.querySelector('.container')?.classList.remove('blur-background');
    this.dialog.closeAll();
  }

  applyFilters(): void {
    document.querySelector('.container')?.classList.remove('blur-background');
    this.dialog.closeAll();
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.coursesSvc
      .getFilteredCourses(
        this.selectedCategories,
        this.selectedPrice,
        this.selectedOrder,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (data) => {
          this.courses = data.courses;
          this.totalItems = data.totalItems;
          this.totalPages = data.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar cursos:', error);
          this.loading = false;
        },
      });
  }

  searchCourses() {
    this.loading = true;
    this.coursesSvc.searchCourses(this.searchTerm).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al buscar cursos:', error);
        this.loading = false;
      },
    });
  }

  onCategorySelected(event: { categoryId: number; selected: boolean }) {
    if (event.selected) {
      if (!this.selectedCategories.includes(event.categoryId)) {
        this.selectedCategories.push(event.categoryId);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (id) => id !== event.categoryId
      );
    }

    if (!this.isSearching) {
      this.loadCourses();
    }
  }

  onPriceSelected(price: string) {
    this.selectedPrice = price;

    if (!this.isSearching) {
      this.loadCourses();
    }
  }

  onOrderSelected(orderBy: string) {
    this.selectedOrder = orderBy;

    if (!this.isSearching) {
      this.loadCourses();
    }
  }
}
