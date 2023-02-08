import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReauthenticateComponent } from '../../dialogs/reauthenticate/reauthenticate.component';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/service/user/user.service';
import { ProfileSettingsComponent } from '../../dialogs/profile-settings/profile-settings.component';
import { AuthService } from 'src/app/service/firebase/auth/auth.service';
import { DialogNoFunctionComponent } from '../../dialogs/dialog-no-function/dialog-no-function.component';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {

  currentUser = new User();

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.get();
    if (!this.currentUser.src) this.currentUser.src = "assets/img/user0.png";
  }

  openAccountSettings(): void {
    this.dialog.open(ReauthenticateComponent);
  }

  openProfileSettings(): void {
    this.dialog.open(ProfileSettingsComponent);
  }

  openNoFunction(): void{
    this.dialog.open(DialogNoFunctionComponent);
  }

  async logout() {
    this.authService.logout();
  }
}