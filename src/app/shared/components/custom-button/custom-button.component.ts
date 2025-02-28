import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [MaterialModule,CommonModule ],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css',
  encapsulation: ViewEncapsulation.None,

})
export class CustomButtonComponent {
  @Input() text: string = 'click';  // Texto del botón
  @Input() className: string = ''; //clase para personalizar el boton
  @Input() disabled: boolean | undefined; //para deshabilitarlo en caso de ser necesario
  @Output() action = new EventEmitter<void>(); // Evento para la acción del botón


  onClick() {
    this.action.emit(); // Dispara el evento cuando se hace clic
  }
}
