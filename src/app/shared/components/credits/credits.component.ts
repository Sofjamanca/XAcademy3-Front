import { Component } from '@angular/core';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.css'
})
export class CreditsComponent {
  images = ['/assets/images/Uni1.png', '/assets/images/Uni2.png', '/assets/images/Uni3.png'];
}
