import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { CardComponent } from './shared/components/card/card.component';
import { CreateCourseComponent } from './shared/components/create-course/create-course.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LandingPageComponent } from "./views/landing-page/landing-page.component";
import { FooterComponent } from './shared/components/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,LandingPageComponent, CardComponent, NgFor,
    RouterOutlet, MatButtonModule, MatDividerModule, MatGridListModule
    ,MatIconModule, MatToolbarModule, FooterComponent, CommonModule, CreateCourseComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'XAcademy3-Front';



}
