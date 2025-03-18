import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../../services/news/news.service';
import { Article } from '../../../core/models/article.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  articleId: number | null = null;
  article: Article | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  formattedDescription: SafeHtml | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.articleId = +id;
        this.loadArticle();
      } else {
        this.error = 'No se encontró el ID del artículo';
        this.isLoading = false;
      }
    });
  }

  loadArticle(): void {
    if (!this.articleId) {
      this.error = 'ID de artículo inválido';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.newsService.getNewsById(this.articleId).subscribe({
      next: (article) => {
        this.article = article;
        
        // Procesar la descripción para preservar saltos de línea
        if (article.description) {
          this.formattedDescription = this.formatTextWithLineBreaks(article.description);
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando artículo:', error);
        this.error = 'No se pudo cargar el artículo. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
        this.showError(this.error);
      }
    });
  }

  getFormattedDate(dateString: string | undefined): string {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getImageUrl(): string {
    if (!this.article) return '';
    return this.article.image_url || this.article.image || 'assets/images/placeholder-image.jpg';
  }

  // Método específico para formatear texto con saltos de línea
  formatTextWithLineBreaks(text: string): SafeHtml {
    if (!text) return '';
    
    // Reemplazar los saltos de línea \n con <br>
    const formattedText = text
      .replace(/\n/g, '<br>')
      // Formato especial para asteriscos (estilo markdown)
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    
    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }

  // Obtener contenido formateado para cualquier campo
  getFormattedContent(content: string | undefined): SafeHtml {
    if (!content) return '';
    return this.formatTextWithLineBreaks(content);
  }

  goBack(): void {
    this.router.navigate(['/noticias']);
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
