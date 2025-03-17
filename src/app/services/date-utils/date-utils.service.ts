import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() { }

  /**
   * Normaliza una fecha a formato ISO string
   * @param date Fecha en formato string o Date
   * @returns Fecha normalizada en formato YYYY-MM-DD
   */
  normalizeDate(date: string | Date): string {
    if (!date) {
      return new Date().toISOString().split('T')[0];
    }
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error al normalizar fecha:', error);
      return new Date().toISOString().split('T')[0];
    }
  }

  /**
   * Formatea una fecha para mostrar en la UI
   * @param date Fecha en formato string o Date
   * @returns Fecha formateada para mostrar al usuario
   */
  formatDateForDisplay(date: Date | string | undefined): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    try {
      return dateObj.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }

  /**
   * Formatea una fecha para ser usada en filtros
   * @param date Fecha en formato string o Date
   * @returns Fecha formateada para filtrado
   */
  formatDateForFilter(date: Date | string | undefined): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    try {
      return dateObj.toLocaleDateString();
    } catch (error) {
      return '';
    }
  }
} 