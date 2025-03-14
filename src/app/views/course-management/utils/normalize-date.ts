export function normalizeDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const result = date.toISOString().split('T')[0]; // Retorna YYYY-MM-DD
      return result;
    } catch (error) {
      console.error('Error normalizando fecha:', dateString, error);
      return dateString; // Si hay error, devolver la fecha original
    }
  }