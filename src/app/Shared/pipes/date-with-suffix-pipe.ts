import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateWithSuffix'
})
export class DateWithSuffixPipe implements PipeTransform {


  transform(value: Date | string | null): string {
    if (!value) return '';

    const date = new Date(value);
    const day = date.getDate();
    const month = date
      .toLocaleString('en-US', { month: 'short' })
      .toUpperCase();

    return `${day}${this.getDaySuffix(day)}, ${month}`;
  }

  private getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'TH';
    }
    switch (day % 10) {
      case 1: return 'ST';
      case 2: return 'ND';
      case 3: return 'RD';
      default: return 'TH';
    }
  }

}
