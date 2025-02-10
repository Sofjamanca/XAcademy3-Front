import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'shared-log-btn',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './log-btn.component.html',
  styleUrl: './log-btn.component.css'
})
export class LogBtnComponent {
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
