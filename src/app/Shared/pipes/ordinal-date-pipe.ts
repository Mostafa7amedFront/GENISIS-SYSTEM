import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinalDate',
  standalone: true
})
export class OrdinalDatePipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });

    return `${day}${this.getOrdinal(day)} of ${month}`;
  }

  private getOrdinal(day: number): string {
    if (day > 3 && day < 21) return 'th';

    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
