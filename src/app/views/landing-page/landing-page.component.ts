import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { CoursesCardsComponent } from "./courses-cards/courses-cards.component";
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'views-landing-page',
  standalone: true,
  imports: [
    HeroComponent,
    CoursesCardsComponent
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'

})
export class LandingPageComponent {


}
