import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-openbox',
  templateUrl: './openbox.component.html',
  styleUrls: ['./openbox.component.scss']
})
export class OpenboxComponent {
  openboxImg = '';

  constructor(public dialogRef: MatDialogRef<OpenboxComponent>) { }

}
