import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService { 
  constructor(private dialog: MatDialog) {}
 
  openModal(component: ComponentType<any>, data?: any) {
    return this.dialog.open(component, {
      width: '90%', //tamaño de la ventana
      height:'auto',//altura de la ventana
      data: data, // esto es para pasar los datos
      disableClose: true,
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
