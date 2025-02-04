import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MenuItem } from '../../../../core/models/menu-item.model';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'shared-header-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent {
  @Input() menuItems?: MenuItem[];
}
