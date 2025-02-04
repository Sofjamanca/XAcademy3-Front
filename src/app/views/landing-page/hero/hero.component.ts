import { Component } from '@angular/core';

@Component({
  selector: 'landing-page-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

  banner1: string = "assets/images/banner-1.png";
  banner2: string = "assets/images/banner-2.png";
  banner3: string = "assets/images/banner-3.png";

}
