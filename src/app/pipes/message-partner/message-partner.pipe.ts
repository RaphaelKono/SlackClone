import { Pipe, PipeTransform, resolveForwardRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { UserService } from 'src/app/service/user/user.service';

@Pipe({
  name: 'messagePartner',
  pure: false,
})
export class MessagePartnerPipe implements PipeTransform {

  filteredUserIds: string[] = [];

  filteredUserNames: string[] = [];

  constructor(private user: UserService, private currentData: CurrentDataService) { }

  transform(users: string[]): string {
    if (!this.currentData.usersAreLoaded)
      return '';
    this.filteredUserNames = [];
    this.filteredUserIds = [];
    this.filteredUserIds = this.getFuids(users);
    this.filteredUserIds.forEach((fuid) => this.findFilteredName(fuid));
    if (this.isChatWithMyself(users))
      return this.filteredUserNames.join(", ") + ' (you)';
    else
      return this.filteredUserNames.join(", ");
  }

  getFuids(users: string[]) {
    if (this.isChatWithMyself(users))
      return [this.user.getUid()];
    else
      return users.filter((user) => (user !== this.user.getUid()));
  }

  findFilteredName(fuid: string) {
    let j = this.currentData.onceSubscribtedUsers.findIndex((user: User) => (user.id === fuid));
    if (this.currentData.onceSubscribtedUsers[j])
      this.filteredUserNames.push(this.currentData.onceSubscribtedUsers[j].name);
    else if (j === -1)
      this.filteredUserNames.push('Deleted User');

  }

  isChatWithMyself(users: string[]) {
    return JSON.stringify(users) === JSON.stringify([this.user.getUid(), this.user.getUid()]);
  }

}
