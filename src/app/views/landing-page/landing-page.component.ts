import { Component } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  cursos = [
    {
      title: 'Curso de Plomería',
      image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fplumber&psig=AOvVaw0900000000000000000&ust=1717416000000000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKC814y00YgDFQAAAAAdAAAAABAE',
      content: 'Aprende a instalar tuberías y sistemas de agua en tu hogar',
      actions: ['Accion 1', 'Accion 2']
    },
    {
      title: 'Curso de Electricidad',
      content: 'Aprende a instalar cables y sistemas eléctricos en tu hogar',
      actions: ['Accion 1', 'Accion 2']
    },
    {
      title: 'Curso de Ceramica',
      content: 'Aprende todo sobre la ceramica',
      actions: ['Accion 1', 'Accion 2']
    }
  ]


}

