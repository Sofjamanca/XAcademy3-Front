import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { HeaderComponent } from './shared/components/header/header.component';
import { LandingPageComponent } from "./views/landing-page/landing-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    LandingPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'XAcademy3-Front';

  


  
}
