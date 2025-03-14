import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { CoursesService } from '../../services/courses/courses.service';
import { Category, Course } from '../../core/models/course.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'views-landing-page',
  standalone: true,
  imports: [
    HeroComponent,
    CardComponent,
    CommonModule,
    MatButtonModule
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'

})
export class LandingPageComponent {

  courses?: Course[];
  categories?: Category[];
  btnContent: string = 'Ver curso';

  values = [
    { icon: 'assets/images/we/Innovadores.png', title: 'Innovadores', content: 'Somos curiosos, nos gustan los desafíos y siempre estamos buscando cómo mejorar nuestro trabajo.' },
    { icon: 'assets/images/we/Proactivos.png', title: 'Proactivos', content: 'Buscamos que las cosas sucedan en vez de quedarnos esperando.' },
    { icon: 'assets/images/we/Equipo.png', title: 'Unidos como equipo', content: 'Somos parte de un equipo que logra resultados increíbles trabajando entre todos.' },
    { icon: 'assets/images/we/Apasionados.png', title: 'Apasionados', content: 'Disfrutamos nuestro día a día y amamos lo que hacemos.' },
    { icon: 'assets/images/we/Globales.png', title: 'Globales', content: 'Perseguimos un pensamiento más allá de nuestras comunidades.' },
    { icon: 'assets/images/we/Perseverantes.png', title: 'Perseverantes', content: 'No nos conformamos con un "no se puede", buscamos que las cosas pasen.' }
  ];

  constructor(private coursesSvc: CoursesService, private router: Router) { }

  ngOnInit() {
    this.coursesSvc.getCourses().subscribe(courses => {
      this.courses = courses;
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
    this.router.navigate(['/course', courseId]);
  }

  goToAllCourses() {
    this.router.navigate(['/courses']);
  }

  // onActionClick(): {
  // }
}
