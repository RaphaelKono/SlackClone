import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/app/models/channel.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { UserService } from 'src/app/service/user/user.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { DialogEditChannelComponent } from '../dialog-edit-channel/dialog-edit-channel.component';

export interface DialogData {
  data: {
    channel: any,
    tab: number
  }
}

@Component({
  selector: 'app-dialog-channel-info',
  templateUrl: './dialog-channel-info.component.html',
  styleUrls: ['./dialog-channel-info.component.scss']
})


export class DialogChannelInfoComponent {

  injected: any = {}
  channel: Channel = new Channel();
  currentUserId: string = '';
  selectNo = 0;

  constructor(public dialogRef: MatDialogRef<DialogChannelInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private user: UserService, private firestoreService: FirestoreService, public dialog: MatDialog, public currentDataService: CurrentDataService) { }

  ngOnInit() {
    this.currentUserId = this.user.getUid();
    this.injected = this.data;
    this.channel = new Channel(this.injected.channel);
    this.selectNo = this.injected.tab;
  }

  async leaveChannel() {
    this.channel.users.splice(this.channel.users.indexOf(this.currentUserId), 1);
    await this.firestoreService.removeUserFromChannel(this.channel.channelId, this.currentUserId);
    this.dialogRef.close('left');
  }

  openEditor() {
    const dialogRef = this.dialog.open(DialogEditChannelComponent, {
      data: this.channel,
    });
    dialogRef.afterClosed().subscribe((result: Channel) => this.setEditedChannel(result));
  }

  setEditedChannel(result: Channel) {
    if (result) {
      this.channel = result;
      this.firestoreService.save(this.channel, 'channels', this.channel.channelId);
    }
  }

  showProfile(uid: string){
    this.dialogRef.close(uid);
  }

  openAddMember(){
    const dialogRef = this.dialog.open(DialogAddMemberComponent, {
      data: {
        channel: this.channel,
      }
    });
  }
}
