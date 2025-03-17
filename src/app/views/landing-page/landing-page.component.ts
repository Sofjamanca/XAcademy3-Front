import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { CoursesService } from '../../services/courses/courses.service';
import { Category, Course } from '../../core/models/course.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ArticleComponent } from '../../shared/components/article/article.component';
import { NewsService } from '../../services/news/news.service';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'views-landing-page',
  standalone: true,
  imports: [
    HeroComponent,
    CardComponent,
    CommonModule,
    MatButtonModule,
    ArticleComponent
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'

})
export class LandingPageComponent {

  courses?: Course[];
  categories?: Category[];
  btnContent: string = 'Ver curso';
  articles: Article[] = [];

  constructor(private coursesSvc: CoursesService, private router: Router, private newsService: NewsService) { }

  ngOnInit() {
    this.coursesSvc.getCourses().subscribe(courses => {
      this.courses = courses.filter(course => course.isActive === true);
    });

    this.newsService.getNews().subscribe(articles => {
      this.articles = articles;
    });


    this.coursesSvc.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  getCategoryTitle(category_id?: number): string {
    return this.categories?.find(cat => cat.id === category_id)?.title || 'Sin categoría';
  }

  goToCourse(courseId?: number) {
    if (!courseId) {
      console.error("El ID del curso es inválido:", courseId);
      return;
    }
    console.log("🔹 Navegando a /course/", courseId);
    this.router.navigate(['/course', courseId]);
  }

  goToAllCourses() {
    this.router.navigate(['/courses']);
  }

  goToArticle(articleId?: number) {
    if (!articleId) {
      console.error("El ID del artículo es inválido:", articleId);
      return;
    }
    this.router.navigate(['/noticias', articleId]);
  }

  getArticles() {
    this.newsService.getNews().subscribe(articles => {
      this.articles = articles;
    });
  }

  // onActionClick(): {
  // }
}
