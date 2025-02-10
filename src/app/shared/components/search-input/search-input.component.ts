import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'shared-search-input',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {

  searchQuery: string = '';

  search() {
    // TODO crear función de búsqueda
  }
}
