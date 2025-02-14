import { MaterialModule } from './../../../material/material.module';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Filter } from '../../../core/models/filter.model';

interface Food {
  value: string;
  viewValue: string;
}

interface Car {
  value: string;
  viewValue: string;
}

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
  selectedValue?: string;
  selectedPrice?: string;

  types: Filter[] = [
    {value: 'recomendados', viewValue: 'Recomendados'},
    {value: 'fecha', viewValue: 'Fecha de actualización'},
    {value: 'populares', viewValue: 'Populares'},
  ];

  prices: Filter[] = [
    {value: 'todos', viewValue: 'Todos'},
    {value: 'gratuitos', viewValue: 'Gratuitos'},
    {value: 'arancelados', viewValue: 'Arancelados'},
  ];
}
