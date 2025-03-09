import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterBtnComponent } from '../buttons/register-btn/register-btn.component';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() title: string = '';
  @Input() category: string = '';
  @Input() description: string = '';
  @Input() action: string = 'Ver curso';
  @Input() image: string = '';
  @Input() modalidad: string = '';
  @Input() price: string = '';
  @Input() quota: number | null = null;
  @Input() hours: number | null = null;
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Input() showFavoriteIcon: boolean = true;
  @Input() showDetails: boolean = false;

  @Output() actionClick = new EventEmitter<void>();

  onActionClick() {
    this.actionClick.emit();
  }

  getModalidadClass(modalidad: string): string {
    if (!modalidad) {
      return '';
    }
    
    switch (modalidad) {
      case 'VIRTUAL':
        return 'virtual-chip';
      case 'PRESENCIAL':
        return 'presencial-chip';
      case 'HÍBRIDO':
        return 'hibrido-chip';
      default:
        return '';
    }
  }
}
