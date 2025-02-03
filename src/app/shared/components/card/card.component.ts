import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatCardTitle} from '@angular/material/card';
import {MatCardContent} from '@angular/material/card';
import {MatCardActions} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatCardImage} from '@angular/material/card';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatCardTitle, MatCardContent, MatCardActions, MatButtonModule, MatCardImage],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() title: string = '';
  @Input() content: string = '';
  @Input() actions: any[] = [];

  @Output() actionClick = new EventEmitter<string>();

  onActionClick(action: string) {
    this.actionClick.emit(action);
  }
}
