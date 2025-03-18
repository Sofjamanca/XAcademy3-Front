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
    MatTooltipModule
  ],
  templateUrl: './list-articles.component.html',
  styleUrls: ['./list-articles.component.css']
})
export class ListArticlesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Article>();
  isLoading: boolean = true;

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
    this.newsService.getNews().subscribe({
      next: (news) => {
        this.dataSource.data = news;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando artículos:', error);
        this.isLoading = false;
      }
    });
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
    





