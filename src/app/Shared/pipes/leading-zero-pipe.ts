import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leadingZero',
  standalone: true
})
export class LeadingZeroPipe implements PipeTransform {

  transform(value: number | string | null | undefined, digits = 2): string {
    const n = Number(value ?? 0);
    if (!Number.isFinite(n)) return String(value ?? '0').padStart(digits, '0');

    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(Math.trunc(n)).toString();

    if (abs.length >= digits) {
      return sign + abs;
    }

    return sign + abs.padStart(digits, '0');
  }
}