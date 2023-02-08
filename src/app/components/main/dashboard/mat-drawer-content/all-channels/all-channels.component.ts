import { Component } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { UserService } from 'src/app/service/user/user.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { Channel } from 'src/app/models/channel.class';
import { SortService } from 'src/app/service/sort/sort.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../../../dialogs/dialog-add-channel/dialog-add-channel.component';
import { NavigationService } from 'src/app/service/navigation/navigation.service';

@Component({
  selector: 'app-all-channels',
  templateUrl: './all-channels.component.html',
  styleUrls: ['./all-channels.component.scss']
})
export class AllChannelsComponent {
  leftSideBar: boolean = false;
  preChannelArr: Channel[] = [];
  channels: Channel[] = [];
  currentUserId: string = '';
  isActive = true;

  constructor(public dialog: MatDialog, public navService: NavigationService, private firestore: Firestore, private userService: UserService, private sorter: SortService, public firestoreService: FirestoreService) { }

  async ngOnInit() {
    this.currentUserId = this.userService.getUid();
    let channelsRef = collection(this.firestore, 'channels');
    const openChannelsQuery = query(channelsRef, where("locked", "==", false));
    const joinedChannelsQuery = query(channelsRef, where("users", "array-contains", this.currentUserId), where("category", "==", 'channel'));
    const createdChannelsQuery = query(channelsRef, where("creator", "==", this.currentUserId)); //If you accidentally leave your own locked channel, it does not get lost
    const queries = await Promise.all([
      await getDocs(openChannelsQuery),
      await getDocs(joinedChannelsQuery),
      await getDocs(createdChannelsQuery)
    ]);
    this.setChannelArr(queries);
  }

  openDialog(): void {
    this.dialog.open(DialogAddChannelComponent);
  }

  setChannelArr(queries: any[]) {
    this.preChannelArr = [];
    queries.forEach(query => query.forEach((doc: any) => this.addToChannel(doc)));
    this.channels = this.preChannelArr.filter((channelElem: Channel, i: number) => this.firstIndexOfDuplicates(channelElem, i));
    this.channels = this.sorter.sortByName(this.channels);
  }

  firstIndexOfDuplicates(channelElem: Channel, i: number){
    return this.preChannelArr.findIndex((channel) => channel.channelId === channelElem.channelId) === i;
  }

  addToChannel(doc: any) {
    let channelElement = new Channel(doc.data());
    channelElement.channelId = doc.id;
    this.preChannelArr.push(channelElement);
  }

  toggleLeftSidebar() {
    this.leftSideBar = !this.leftSideBar;
    this.navService.workspaceBar.toggle();
  }

  isInChannel(channel:Channel){
    return channel.users.indexOf(this.currentUserId) !== -1;
  }

  addUserToChannel(c: number){
    this.channels[c].users.push(this.currentUserId);
    this.firestoreService.pushUserToChannel(this.channels[c].channelId,this.currentUserId);
  }

  removeUserFromChannel(c: number){
    this.channels[c].users.splice(this.channels[c].users.indexOf(this.currentUserId),1);
    this.firestoreService.removeUserFromChannel(this.channels[c].channelId,this.currentUserId);
  }
}
