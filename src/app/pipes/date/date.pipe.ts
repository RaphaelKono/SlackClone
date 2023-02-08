import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: Timestamp | Date | string): string {
    if ((typeof value !== 'string')) {
      if (!(value instanceof Date)) value = value.toDate();
      if (value instanceof Date) value = value.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
    return value;
  }
}
