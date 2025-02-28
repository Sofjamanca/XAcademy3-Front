import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'shared-search-input',
  standalone: true,
  imports: [
    MatInputModule,
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
