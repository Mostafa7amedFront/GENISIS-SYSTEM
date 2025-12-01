import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthDay'
})
export class MonthDayPipe implements PipeTransform {
transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);

    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate().toString().padStart(2, '0');

    return `${month} ${day}`;
  }

}
