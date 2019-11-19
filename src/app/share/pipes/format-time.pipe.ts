import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: number): number | string {
    if (time) {
      const temp = time | 0;
      const min = temp / 60 | 0;
      const seconds = (temp % 60).toString().padStart(2, '0');
      return `${min}:${seconds}`;
    } else {
      return '00:00';
    }
  }

}
