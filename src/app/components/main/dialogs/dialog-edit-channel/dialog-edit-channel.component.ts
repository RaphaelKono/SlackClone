import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { UserService } from 'src/app/service/user/user.service';

export interface DialogData2 {
  channel: any
}

@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss']
})
export class DialogEditChannelComponent {
  

  injected: any = {}
  channel: Channel = new Channel();
  currentUserId: string = '';
  editChannelForm = new FormGroup({
    topic: new FormControl(this.channel.topic, []),
    description: new FormControl(this.channel.description, [])
  });

  constructor(public dialogRef: MatDialogRef<DialogEditChannelComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData2, private user: UserService, private firestoreService: FirestoreService, public dialog: MatDialog) { }

  ngOnInit() {
    this.currentUserId = this.user.getUid();
    this.injected = this.data;
    this.channel = new Channel(this.injected);
    this.setFormGroup();
  }

  setFormGroup(){
    this.editChannelForm = new FormGroup({
      topic: new FormControl(this.channel.topic, []),
      description: new FormControl(this.channel.description, [])
    });
  }

  onSubmit() {
    if (this.editChannelForm.valid) {
      this.editChannel();
    }
  }

  editChannel() {
    this.channel.topic = this.editChannelForm.controls.topic.value || '';
    this.channel.description = this.editChannelForm.controls.description.value || '';
    this.dialogRef.close(this.channel);
  }

}
