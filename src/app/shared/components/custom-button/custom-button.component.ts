import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [MatButtonModule ],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css'
})
export class CustomButtonComponent {
  @Input() text: string = 'click';  // Texto del botón
  @Input()  className!: string; //clase para personalizar el boton
  @Output() action = new EventEmitter<void>(); // Evento para la acción del botón

  onClick() {
    this.action.emit(); // Dispara el evento cuando se hace clic
  }
}
