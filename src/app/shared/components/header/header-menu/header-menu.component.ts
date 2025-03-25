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
  @Input() menuItems: any[] = [];
  @Input() isMobile = false;
  @Input() isTablet = false;
  @Output() itemClick = new EventEmitter<void>();

  handleClick() {
    if (this.isMobile) {
      this.itemClick.emit();
    }
  }
  
  
}
