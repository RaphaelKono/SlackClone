import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  constructor() { }

  sortByDate(array: any[]) {
    let self = this;
    array.sort(function (
      a: { creationDate: Timestamp },
      b: { creationDate: Timestamp }
    ) {
      return self.compareDate(a.creationDate.seconds, b.creationDate.seconds);
    });
    return array;
  }

  compareDate(a: number, b: number) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  sortByName(array: any[]) {
    let self = this;
    array = array.sort(function (
      a: { channelName: string },
      b: { channelName: string }
    ) {
      return self.compareStrings(a.channelName, b.channelName);
    });
    return array;
  }

  compareStrings(a: string, b: string) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
  }
}
