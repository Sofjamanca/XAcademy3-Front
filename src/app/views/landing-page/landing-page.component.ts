import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'views-landing-page',
  standalone: true,
  imports: [
    HeroComponent,
    CardComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'

})
export class LandingPageComponent {


  
  
}
