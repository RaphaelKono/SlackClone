import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { UserService } from 'src/app/service/user/user.service';

export interface DialogData3 {
  data: {
    channel: any
  }
}

@Component({
  selector: 'app-dialog-add-member',
  templateUrl: './dialog-add-member.component.html',
  styleUrls: ['./dialog-add-member.component.scss']
})
export class DialogAddMemberComponent {

  injected: any = {}
  channel: Channel = new Channel();
  currentUserId: string = '';
  selectNo = 0;
  allUsers: User[] = [];
  newChannelMembers: User[] = [];
  mymodel: any;
  searchUsers = '';
  leftSideBar: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogAddMemberComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData3, private user: UserService, private firestoreService: FirestoreService, public dialog: MatDialog, public currentDataService: CurrentDataService, private pushupMessage: PushupMessageService) { }

  ngOnInit() {
    this.currentDataService.setChatUsers([]);
    this.currentUserId = this.user.getUid();
    this.injected = this.data;
    this.channel = new Channel(this.injected.channel);
    this.currentDataService.usersAreLoaded$.subscribe((areLoaded) => {
      if (areLoaded) {
        this.allUsers = this.currentDataService.users;
      }
    });
  }

  async valuechange(newValue: any) {
    this.searchUsers = newValue;
  }

  deleteUserToChat(user: User) {
    const foundIndex = this.newChannelMembers.indexOf(user);
    this.newChannelMembers.splice(foundIndex, 1);
    this.currentDataService.setChatUsers(this.newChannelMembers);
  }

  addUser(user: User, input: HTMLInputElement) {
    if (!this.channel.users.includes(user.id))
      this.validateUser(user, input);
    else
      this.pushupMessage.openPushupMessage('error', 'User is already in the channel');
  }

  validateUser(user: User, input: HTMLInputElement) {
    if (this.isMe(user))
      this.pushupMessage.openPushupMessage('error', 'Unfortunately, you cannot add yourself');
    else
      this.addValidUser(user, input);
  }

  isMe(user: User) {
    return user.id === this.currentUserId;
  }

  addValidUser(user: User, input: HTMLInputElement) {
    this.newChannelMembers.push(user);
    this.currentDataService.setChatUsers(this.newChannelMembers);
    input.value = '';
    this.searchUsers = '';
  }

  async addMembers(){
    this.newChannelMembers.forEach(member => this.channel.users.push(member.id));
    await this.firestoreService.save(this.channel, 'channels', this.channel.channelId);
    this.dialogRef.close();
  }

}
