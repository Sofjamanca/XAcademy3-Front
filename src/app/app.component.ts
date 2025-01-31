import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { CustomButtonComponent } from "./shared/components/custom-button/custom-button.component";
import { ModalService } from './core/services/modal/modal.service';
import { LoginComponent } from './views/auth/login/login.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule, MatIconModule,
    CustomButtonComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'XAcademy3-Front';

  constructor(private modalService: ModalService){}


  openLogin() {
    this.modalService.openModal(LoginComponent, { title: 'Explora, Aprende, Crece' });
  }

  
}
