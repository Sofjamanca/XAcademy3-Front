import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { CardComponent } from './shared/components/card/card.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LandingPageComponent } from "./views/landing-page/landing-page.component";
import { MaterialModule } from './material/material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,LandingPageComponent, CardComponent, NgFor,
    RouterOutlet, FooterComponent, CommonModule, MaterialModule

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'XAcademy3-Front';

  cursos = [
    {
      title: 'Curso de Plomería',
      image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fplumber&psig=AOvVaw0900000000000000000&ust=1717416000000000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKC814y00YgDFQAAAAAdAAAAABAE',
      content: 'Aprende a instalar tuberías y sistemas de agua en tu hogar',
      actions: ['Ver curso']
    },
    {
      title: 'Curso de Electricidad',
      content: 'Aprende a instalar cables y sistemas eléctricos en tu hogar',
      actions: ['Ver curso']
    },
    {
      title: 'Curso de Ceramica',
      content: 'Aprende todo sobre la ceramica',
      actions: ['Ver curso']
    }
  ]



}
