import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PushupMessageComponent } from 'src/app/components/pushup-message/pushup-message.component';

@Injectable({
  providedIn: 'root'
})
export class PushupMessageService {

  constructor(private snackBar: MatSnackBar) { }

  openPushupMessage(type: 'error' | 'success' | 'info', message: string) {
    this.snackBar.openFromComponent(PushupMessageComponent, {
      data: {
        type: type,
        message: message
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type
    });
  }
}
