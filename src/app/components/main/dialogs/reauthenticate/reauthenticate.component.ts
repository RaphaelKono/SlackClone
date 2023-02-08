import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/service/firebase/auth/auth.service';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';
import { UserService } from 'src/app/service/user/user.service';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';

@Component({
  selector: 'app-reauthenticate',
  templateUrl: './reauthenticate.component.html',
  styleUrls: ['./reauthenticate.component.scss']
})
export class ReauthenticateComponent {
  currentUser!: User;
  password = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<ReauthenticateComponent>,
    private dialog: MatDialog,
    public userService: UserService,
    private formErrorService: FormErrorService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
  }

  async reauthenticate() {
    if (this.password.valid) {
      let password = this.password.value.password!;
      await this.authService.reauthenticate(password)
        .then(() => {
          this.dialog.open(AccountSettingsComponent)
          this.dialogRef.close();
        });
    }
  }

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.formErrorService.getMessage(formGroup, formControlName)
  }
}