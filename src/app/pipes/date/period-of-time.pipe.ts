import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

@Pipe({
  name: 'periodOfTime'
})
export class PeriodOfTimePipe implements PipeTransform {

  newValue = '';

  transform(creationTime: Timestamp | Date | string): any {
    if ((typeof creationTime !== 'string')) {
      if (!(creationTime instanceof Date)) creationTime = creationTime.toDate();
      if (creationTime instanceof Date) {
        this.newValue = this.evaluatePeriod(creationTime.getTime());
      }
      return this.newValue;
    }
  }

  evaluatePeriod(postCreationTime: number) {
    let currentTime = new Date().getTime();
    let timeDifference = (currentTime - postCreationTime) / 1000;
    if (timeDifference < ONE_MINUTE)
      return Math.round(timeDifference) + " seconds";
    else if (timeDifference < ONE_HOUR)
      return Math.round(timeDifference / ONE_MINUTE) + " minutes";
    else if (timeDifference < ONE_DAY)
      return Math.round(timeDifference / ONE_HOUR) + " hours";
    else
      return Math.round(timeDifference / ONE_DAY) + " days";
  }
}
