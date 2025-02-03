import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LogBtnComponent } from '../buttons/log-btn/log-btn.component';
import { RegisterBtnComponent } from '../buttons/register-btn/register-btn.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { MenuItem } from '../../../core/models/menu-item.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SearchInputComponent } from '../search-input/search-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    RegisterBtnComponent,
    LogBtnComponent,
    HeaderMenuComponent,
    MatFormFieldModule,
    SearchInputComponent,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  imgLogo: string = "/assets/images/logo.png";

  menuItems: MenuItem[] = [
    {text: "Inicio", route: ""},
    {text: "Cursos", route: ""},
    {text: "Nosotros", route: ""},
    {text: "Contacto", route: ""},
  ]

  menuOpen: boolean = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

}
