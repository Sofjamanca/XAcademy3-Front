import { Pipe, PipeTransform } from '@angular/core';
import { Class } from '../../core/models/class.model';

@Pipe({
  name: 'find',
  standalone: true
})
export class FindClassPipe implements PipeTransform {
  transform(classes: Class[] | null, classId: number | null): Class | undefined {
    if (!classes || !classId) return undefined;
    return classes.find(c => c.id === classId);
  }
} 