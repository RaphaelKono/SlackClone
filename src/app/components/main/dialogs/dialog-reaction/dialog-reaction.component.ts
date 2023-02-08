import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-reaction',
  templateUrl: './dialog-reaction.component.html',
  styleUrls: ['./dialog-reaction.component.scss']
})
export class DialogReactionComponent {

  constructor(public dialogRef: MatDialogRef<DialogReactionComponent>){}

}
