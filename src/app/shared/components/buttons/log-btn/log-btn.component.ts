import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'shared-log-btn',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './log-btn.component.html',
  styleUrl: './log-btn.component.css'
})
export class LogBtnComponent {

}
