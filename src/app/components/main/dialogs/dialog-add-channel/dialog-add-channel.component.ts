import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss']
})
export class DialogAddChannelComponent {
  channelForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.maxLength(80)),
    locked: new FormControl('')
  });
  channel: Channel = new Channel();
  locked = false;

  constructor(public dialogRef: MatDialogRef<DialogAddChannelComponent>, private setFirestore: FirestoreService, private user: UserService) { }

  onSubmit() {
    if (this.channelForm.valid) {
      this.createNewChannel();
    }
  }

  async createNewChannel() {
    this.channel = new Channel();
    this.channel.channelName = this.channelForm.controls.name.value || '';
    this.channel.channelName = this.channel.channelName.replace(/ /g, '-');
    this.channel.channelName = this.channel.channelName.toLocaleLowerCase();
    this.channel.description = this.channelForm.controls.description.value || '';
    if (this.channelForm.controls.locked.value === '' || this.channelForm.controls.locked.value === null)
      this.channel.locked = false;
    else
      this.channel.locked = this.channelForm.controls.locked.value;
    this.channel.creator = this.user.getUid();
    this.channel.users.push(this.channel.creator);
    await this.setFirestore.save(this.channel, 'channels');
    this.dialogRef.close();
  }

  toggleLock() {
    this.locked = !this.locked;
  }
}
