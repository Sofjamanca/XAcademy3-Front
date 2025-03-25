import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  isCollapsed = false;
  isMobile = false;
  
  menuItems = [
    { icon: 'dashboard', label: 'Panel', route: '/admin' },
    { icon: 'school', label: 'Cursos', route: '/admin/cursos' },
    { icon: 'people', label: 'Profesores', route: '/admin/profesores' },
    { icon: 'payments', label: 'Pagos', route: '/admin/pagos' },
    { icon: 'newspaper', label: 'Noticias', route: '/admin/noticias' },
    { icon: 'settings', label: 'Configuracion', route: '/admin/ajustes' },

  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkScreenSize();
    
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.isCollapsed = true; // Colapsar sidebar al cambiar de ruta
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isCollapsed = true; // Colapsar automáticamente en móvil
    }
  }

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
  }
} 