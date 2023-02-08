import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';

@Pipe({
  name: 'username'
})
export class UsernamePipe implements PipeTransform {

  constructor(private currentData: CurrentDataService) { }


  transform(userId: string | string[]): string {
    if (!this.currentData.usersAreLoaded)
      return 'Member';
    if (typeof userId == 'string')
      return this.convertUidString(userId);
    else
      return this.convertUidArray(userId);
  }

  convertUidString(userId: string) {
    let j = this.currentData.users.findIndex((user: User) => (user.id === userId));
    if (j == -1) {
      return 'Deleted User';
    }
    return this.currentData.users[j].name;
  }

  convertUidArray(userIds: string[]) {
    let names: string[] = [];
    userIds.forEach(uid => {
      let j = this.currentData.users.findIndex((user: User) => (user.id === uid));
      names.push(this.currentData.users[j].name);
    });
    return names.join(', ');
  }

}
