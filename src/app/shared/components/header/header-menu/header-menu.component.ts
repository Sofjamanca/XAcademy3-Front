import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
    RouterLinkActive 
  ],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent {
  @Input() menuItems?: MenuItem[];
  @Output() itemClick = new EventEmitter<void>();

  itemClicked(): void {
    this.itemClick.emit();
  }

  activeMenuItem: string = '';

  setActive(menuItemRoute: string) {
    this.activeMenuItem = menuItemRoute;
  }
  
}
