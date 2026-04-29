import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multilineText'
})
export class MultilineTextPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const text = String(value)
      .replace(/\r\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .trim();

    return text;
  }
}
