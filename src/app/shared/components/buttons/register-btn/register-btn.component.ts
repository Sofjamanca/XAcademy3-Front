import { Component, EventEmitter, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'shared-register-btn',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './register-btn.component.html',
  styleUrl: './register-btn.component.css'
})
export class RegisterBtnComponent {
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
