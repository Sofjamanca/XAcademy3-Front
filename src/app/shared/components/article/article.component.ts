import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Article } from '../../../core/models/article.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent {
  @Input() article!: Article;
  @Input() showFullContent: boolean = false;

  constructor(private router: Router) {}

  goToArticle(id: number) {
    this.router.navigate(['/noticias', id]);
  }


  getFormattedDate(dateString: string | undefined): string {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getImageUrl(): string {
    return this.article.image_url || this.article.image || 'assets/images/placeholder-image.webp';
  }

  getContentPreview(content: string | undefined): string {
    if (!content) return '';
    return content.length > 150 ? content.substring(0, 147) + '...' : content;
  }
}

