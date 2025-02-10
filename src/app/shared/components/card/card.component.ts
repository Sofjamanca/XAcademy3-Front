import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterBtnComponent } from '../buttons/register-btn/register-btn.component';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    RegisterBtnComponent,
    MaterialModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() actions: string[] = [];
  @Input() image: string = '';

  @Output() actionClick = new EventEmitter<string>();

  onActionClick(action: string) {
    this.actionClick.emit(action);
  }
}
