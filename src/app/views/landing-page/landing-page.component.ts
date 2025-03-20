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
    ArticleComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  courses?: Course[];
  categories?: Category[];
  btnContent: string = 'Ver curso';
  articles: Article[] = [];
  loading: boolean = true;

  values = [
    {
      icon: 'assets/images/we/Innovadores.webp',
      title: 'Innovadores',
      content:
        'Somos curiosos, nos gustan los desafíos y siempre estamos buscando cómo mejorar nuestro trabajo.',
    },
    {
      icon: 'assets/images/we/Proactivos.webp',
      title: 'Proactivos',
      content: 'Buscamos que las cosas sucedan en vez de quedarnos esperando.',
    },
    {
      icon: 'assets/images/we/Equipo.webp',
      title: 'Unidos como equipo',
      content:
        'Somos parte de un equipo que logra resultados increíbles trabajando entre todos.',
    },
    {
      icon: 'assets/images/we/Apasionados.webp',
      title: 'Apasionados',
      content: 'Disfrutamos nuestro día a día y amamos lo que hacemos.',
    },
    {
      icon: 'assets/images/we/Globales.webp',
      title: 'Globales',
      content: 'Perseguimos un pensamiento más allá de nuestras comunidades.',
    },
    {
      icon: 'assets/images/we/Perseverantes.webp',
      title: 'Perseverantes',
      content:
        'No nos conformamos con un "no se puede", buscamos que las cosas pasen.',
    },
  ];
  constructor(
    private coursesSvc: CoursesService,
    private router: Router,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.loading = true;
    console.log('Landing page init - loading state:', this.loading);

    this.coursesSvc.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses.filter((course) => course.isActive === true);
        this.loading = false;
        console.log('Courses loaded - loading state:', this.loading);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading = false; // También cambiar a false en caso de error
        this.courses = [];
      },
    });

    this.newsService.getNews().subscribe((articles) => {
      this.articles = articles;
    });

    this.coursesSvc.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  getCategoryTitle(category_id?: number): string {
    return (
      this.categories?.find((cat) => cat.id === category_id)?.title ||
      'Sin categoría'
    );
  }

  goToCourse(courseId?: number) {
    if (!courseId) {
      console.error('El ID del curso es inválido:', courseId);
      return;
    }
    this.router.navigate(['/course', courseId]);
  }

  goToAllCourses() {
    this.router.navigate(['/courses']);
  }

  goToArticle(articleId?: number) {
    if (!articleId) {
      console.error('El ID del artículo es inválido:', articleId);
      return;
    }
    this.router.navigate(['/noticias', articleId]);
  }

  getArticles() {
    this.newsService.getNews().subscribe((articles) => {
      this.articles = articles;
    });
  }

  // onActionClick(): {
  // }
}
