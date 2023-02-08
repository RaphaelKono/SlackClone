import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { UserService } from 'src/app/service/user/user.service';

const DEFAULT_IMG = 'assets/img/user0.png';

@Pipe({
  name: 'imgSrc'
})

/** This pipe is to get the user image source-file by user-id. */
export class ImgSrcPipe implements PipeTransform {

  allUsers: User[] = [];
  currentUserId: string = '';

  constructor(private currentData: CurrentDataService, private user: UserService) { }

  transform(userId: string | string[], users: User[]): string {
    this.allUsers = users;
    this.currentUserId = this.user.getUid();
    if (this.currentData.usersAreLoaded)
      return this.findImgSrc(userId);
    else
      return DEFAULT_IMG;
  }

  findImgSrc(userId: string | string[]) {
    if (typeof userId == 'string')
      return this.convertUidString(userId);
    else
      return this.convertUidArray(userId);
  }

  convertUidString(userId: string) {
    let i = this.allUsers.findIndex((user: User) => (user.id === userId));
    if (i == -1)
      return DEFAULT_IMG;
    else
      return this.allUsers[i].src;
  }


  convertUidArray(userIds: string[]) {
    let srcs: string[] = [];
    userIds.forEach(uid => this.pushSrc(uid, srcs));
    if (srcs.length > 0)
      return srcs[0];
    else
      return this.user.currentUser.src;
  }

  pushSrc(uid: string, srcs: string[]) {
    let i = this.allUsers.findIndex((user: User) => (user.id === uid && uid !== this.currentUserId));
    if (i !== -1)
      srcs.push(this.allUsers[i].src);
  }

  
}
