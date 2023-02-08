import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { DialogAddChannelComponent } from '../../../dialogs/dialog-add-channel/dialog-add-channel.component';
import { UserService } from 'src/app/service/user/user.service';
import { EMPTY } from 'rxjs';
import { SortService } from 'src/app/service/sort/sort.service';
import { User } from 'src/app/models/user.class';
import { onSnapshot } from '@angular/fire/firestore';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { Channel } from 'src/app/models/channel.class';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogNoFunctionComponent } from '../../../dialogs/dialog-no-function/dialog-no-function.component';
import { NavigationService } from 'src/app/service/navigation/navigation.service';

@Component({
  selector: 'app-workspace-bar',
  templateUrl: './workspace-bar.component.html',
  styleUrls: ['./workspace-bar.component.scss']
})
export class WorkspaceBarComponent {
  panelOpenState = false;
  channels: Channel[] = [];
  collChannels$: any = EMPTY;

  privates: Channel[] = [];
  collPrivates$: any = EMPTY;

  currentUser: User = new User();
  username: string = 'valer';
  user$: any = EMPTY;

  users: any[] = [];
  userActive = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public dialog: MatDialog, public firestoreService: FirestoreService, private sort: SortService, private userService: UserService, public currentData: CurrentDataService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public navService: NavigationService, private router: Router, private route: ActivatedRoute) {
    this.mobileQuery = media.matchMedia('(max-width: 500px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.currentUser = this.userService.get();
    this.currentData.usersAreLoaded$.subscribe((areLoaded) => {
      if (areLoaded) {
        this.users = this.currentData.users;
      }
    })
    const q1 = this.firestoreService.getCurrentUserData('channels', 'users', this.userService.getUid());
    const resp = onSnapshot(q1, (querySnapshot: any) => this.snapShotChannel(querySnapshot));
    this.currentData.snapshot_arr.push(resp);
  }

  openDialog(): void {
    this.dialog.open(DialogAddChannelComponent);
  }

  snapShotChannel(querySnapshot: any) {
    this.channels = [];
    this.privates = [];
    querySnapshot.forEach((doc: any) => this.pushIntoChannel(doc));
    this.setChannelsAndPrivates();
  }

  setChannelsAndPrivates() {
    this.currentData.setAllChannels(this.channels);
    this.privates = this.channels.filter(this.categoryIsPrivate);
    this.privates = this.sort.sortByName(this.privates);
    this.channels = this.channels.filter(this.categoryIsChannel);
    this.channels = this.sort.sortByName(this.channels);
    this.currentData.setPrivates(this.privates);
    this.currentData.setChannels(this.channels);
  }

  categoryIsChannel(channel: Channel) {
    return channel.category == 'channel';
  }

  categoryIsPrivate(channel: Channel) {
    return channel.category == 'private';
  }

  pushIntoChannel(doc: any) {
    let channel = new Channel(doc.data());
    channel.channelId = doc.id;
    this.channels.push(channel);
  }

  isUserActive(msgUsers: string[], allUsers: any[]) {
    let user: any;
    msgUsers.forEach((uid) => {
      let foundUser: any = allUsers.find((user: any) => (user.id === uid && uid !== this.currentUser.id));
      if (foundUser)
        user = foundUser;
    });
    if (msgUsers.length == 2 && msgUsers[0] === msgUsers[1])
      return this.userService.userState(this.currentUser);
    else if (user)
      return this.otherUserState(user);
    else
      return false;
  }

  otherUserState(user: any) {
    if (!(user.lastLogin instanceof Date))
      user.lastLogin = user.lastLogin.toDate();
    return this.userService.userState(user);
  }

  toggleSidenav() {
    if (this.mobileQuery.matches)
      this.navService.workspaceBar.toggle();
  }

  navigateToRoute(url: string) {
    this.router.navigate([url], { relativeTo: this.route });
    this.toggleSidenav();
  }

  navigateToBookmarks() {
    this.router.navigate([{ outlets: { right: ['bookmarks'] } }], { relativeTo: this.route });
  }

  openNoFunction(): void{
    this.dialog.open(DialogNoFunctionComponent);
  }

}