import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Carolina Méndez',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      course: 'Maquillaje para eventos',
      rating: 5,
      quote:
        'El curso cambió mi vida profesional por completo. En menos de 6 meses conseguí mi primer trabajo como maquilladora.',
    },
    {
      name: 'Martín Rodríguez',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      course: 'Electricidad del hogar',
      rating: 5,
      quote:
        'La metodología práctica y el apoyo de los profesores fue clave para entender conceptos complejos. Muy recomendable.',
    },
    {
      name: 'Sofía Peralta',
      profileImage: 'https://randomuser.me/api/portraits/women/68.jpg',
      course: 'Electricidad',
      rating: 4,
      quote:
        'La metodología práctica y el apoyo de los profesores fue clave para entender conceptos complejos. Muy recomendable.',
    },
    {
      name: 'Lucas González',
      profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
      course: 'Plomería',
      rating: 5,
      quote:
        'El contenido actualizado y la comunidad de estudiantes hacen que valga cada centavo. ¡Ya publiqué mi primera app!',
    },
  ];
}
