import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pushup-message',
  templateUrl: './pushup-message.component.html',
  styleUrls: ['./pushup-message.component.scss']
})

export class PushupMessageComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snakcBarRef: MatSnackBarRef<PushupMessageComponent>) { }
}