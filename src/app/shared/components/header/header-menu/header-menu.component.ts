import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MenuItem } from '../../../../core/models/menu-item.model';
import { MaterialModule } from '../../../../material/material.module';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'shared-header-menu',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
  ],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent {
  @Input() menuItems?: MenuItem[];
}
