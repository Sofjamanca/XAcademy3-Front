import { MaterialModule } from './../../../material/material.module';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Filter } from '../../../core/models/filter.model';
import { CoursesService } from '../../../services/courses/courses.service';

@Component({
  selector: 'shared-filter',
  standalone: true,
  imports: [
    FormsModule,
    MaterialModule
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Input() selectedPrice: string = '';
  @Input() selectedOrder: string = '';
  @Output() priceSelected = new EventEmitter<string>();
  @Output() orderSelected = new EventEmitter<string>();

  orders: Filter[] = [
    { value: 'recomendados', viewValue: 'Recomendados' },
    { value: 'fecha', viewValue: 'Fecha de actualización' },
    { value: 'populares', viewValue: 'Populares' },
  ];

  prices: Filter[] = [
    { value: '', viewValue: 'Todos' },
    { value: 'gratuitos', viewValue: 'Gratuitos' },
    { value: 'arancelados', viewValue: 'Arancelados' },
  ];

  constructor(private coursesSvc: CoursesService) {}

  onPriceSelected(value: string) {
    this.selectedPrice = value;
    this.priceSelected.emit(value);
  }

  onOrderSelected(value: string) {
    this.selectedOrder = value;
    this.orderSelected.emit(value);
  }
}

