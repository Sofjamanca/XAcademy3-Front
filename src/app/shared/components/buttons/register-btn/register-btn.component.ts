import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'shared-register-btn',
  standalone: true,
  imports: [
    MaterialModule
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
