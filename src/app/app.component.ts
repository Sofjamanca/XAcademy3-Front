import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from "./views/landing-page/landing-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LandingPageComponent, RouterOutlet, CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
