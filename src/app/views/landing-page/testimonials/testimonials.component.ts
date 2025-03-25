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
      profileImage: 'https://randomuser.me/api/portraits/women/57.jpg',
      course: 'Maquillaje para eventos',
      rating: 5,
      quote:
        'Este curso no solo me enseñó técnicas de maquillaje, sino a entender diferentes tipos de piel y necesidades.',
    },
    {
      name: 'Martín Rodríguez',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      course: 'Carpintería',
      rating: 5,
      quote:
        'El curso me dio las herramientas para iniciar mi propio emprendimiento de carpintería. En menos de un año, pasé de principiante a tener mi taller con clientes regulares. Inversión que cambió mi vida.',
    },
    {
      name: 'Sofía Peralta',
      profileImage: 'https://randomuser.me/api/portraits/women/47.jpg',
      course: 'Electricidad',
      rating: 4,
      quote:
        'Aprendí a hacer instalaciones seguras y a detectar problemas eléctricos que antes hubieran requerido contratar a un profesional. Muy agradecida por lo aprendido',
    },
    {
      name: 'Lucas González',
      profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
      course: 'Plomería',
      rating: 5,
      quote:
        'Ahora puedo solucionar cualquier problema de cañerías en mi hogar y ayudar a mis vecinos. Las técnicas enseñadas son prácticas y fáciles de aplicar.',
    },
  ];
}
