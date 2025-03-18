import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../../services/news/news.service';
import { Article } from '../../../core/models/article.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ArticleComponent } from '../../../shared/components/article/article.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ArticleComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  isLoading: boolean = true;
  totalArticles: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [3, 6, 9, 12];
  currentPage: number = 0;

  constructor(
    private newsService: NewsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.isLoading = true;
    this.newsService.getNews().subscribe({
      next: (response: Article[]) => {
        this.articles = response;
        this.totalArticles = this.articles.length;
        this.updatePagedArticles();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando artículos:', error);
        this.isLoading = false;
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedArticles();
  }

  updatePagedArticles(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.filteredArticles = this.articles.slice(startIndex, startIndex + this.pageSize);
  }
}
