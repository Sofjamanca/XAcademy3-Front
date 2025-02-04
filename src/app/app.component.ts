import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';  

import { CardComponent } from './shared/components/card/card.component';

import { HeaderComponent } from './shared/components/header/header.component';
import { LandingPageComponent } from "./views/landing-page/landing-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,LandingPageComponent, CardComponent,
    RouterOutlet, MatButtonModule, MatDividerModule, MatGridListModule
    ,MatIconModule, MatToolbarModule, FooterComponent, CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'XAcademy3-Front';

  
  

  
}
