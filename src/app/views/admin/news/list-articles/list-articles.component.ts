import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../../../../services/news/news.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Article } from '../../../../core/models/article.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-list-articles',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PaginationComponent,
  ],
  templateUrl: './list-articles.component.html',
  styleUrls: ['./list-articles.component.css']
})
export class ListArticlesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Article>();
  isLoading: boolean = true;

  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  sortColumn: string = '';
  sortDirection: string = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private newsService: NewsService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadArticles() {
    this.isLoading = true;
    console.log(`Solicitando artículos ordenados por ${this.sortColumn} en dirección ${this.sortDirection}`);
    
    this.newsService.getOrderedNews(this.sortColumn, this.sortDirection, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        
        // Mapear los datos de la respuesta
        this.dataSource.data = response.news || [];
        this.totalItems = response.total || 0;
        this.totalPages = response.totalPages || Math.ceil(this.totalItems / this.pageSize) || 0;
        
        console.log(`Recibidos ${this.dataSource.data.length} artículos de un total de ${this.totalItems}`);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando artículos:', error);
        this.isLoading = false;
      }
    });
  }

  sortData(column: string) {
    const columnMap: { [key: string]: string } = {
      'id': 'id',
      'title': 'title',
      'createdAt': 'date'
    };

    const backendColumn = columnMap[column] || column;
    
    if (this.sortColumn === backendColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = backendColumn;
      this.sortDirection = 'asc';
    }
    
    this.currentPage = 1;
    
    console.log(`Ordenando por ${this.sortColumn} en dirección ${this.sortDirection}`);
    this.loadArticles();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadArticles();
  }
  
  isColumnSortable(column: string): boolean {
    return ['id', 'title', 'createdAt'].includes(column);
  }

  
  createArticle() {
    this.router.navigate(['/admin/noticias/crear']);
  }

  viewArticle(article: Article) {
    this.router.navigate(['/noticias/', article.id]);
  }

  editArticle(article: Article) {
    this.router.navigate(['/admin/noticias/editar', article.id]);
  }

  deleteArticle(article: Article) {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      this.newsService.deleteNews(article.id).subscribe({
        next: () => {
          this.loadArticles();
          this.snackBar.open('Artículo eliminado correctamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error eliminando artículo:', error);
        }
      });
    }
  }

  getContentPreview(content: string): string {
    return content && content.length > 100 ? content.substring(0, 97) + '...' : content;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'publicado':
        return 'status-published';
      case 'draft':
      case 'borrador':
        return 'status-draft';
      case 'archived':
      case 'archivado':
        return 'status-archived';
      default:
        return 'status-draft';
    }
  }
}
    





