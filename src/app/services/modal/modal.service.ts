import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService { 
  constructor(private dialog: MatDialog) {}
 
  openModal<T>(
    component: ComponentType<T>, 
    data: any = {}, 
    config: Partial<MatDialogConfig> = {}
  ): MatDialogRef<T> {
    const defaultConfig: MatDialogConfig = {
      maxWidth: '90vw',
      width:'100%', 
      height: 'auto',
      maxHeight: '100vh',
      disableClose: true, // Evitar cierre accidental
      data:data
    };

    return this.dialog.open(component, { ...defaultConfig, ...config }); // Merge de opciones
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
