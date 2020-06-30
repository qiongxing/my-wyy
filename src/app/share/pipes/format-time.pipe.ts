import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      const temp = value;
      const minute = (temp / 60) | 0;
      const second = ((temp % 60) | 0).toString().padStart(2, '0');
      return `${minute}:${second}`;
    } else {
      return "00:00";
    }
  }

}
