import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { NavigationService } from 'src/app/service/navigation/navigation.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent {
  collPath: string = '';
  usersToChat: User[] = [];
  allUsers: User[] = [];
  mymodel: any;
  searchUsers = '';
  leftSideBar: boolean = false;
  currentUserId: string = '';

  constructor(public firestoreService: FirestoreService, private currentDataService: CurrentDataService, private pushupMessage: PushupMessageService, private navService: NavigationService, private user: UserService) { }

  ngOnInit() {
    this.currentDataService.setChatUsers([]);
    this.currentUserId = this.user.getUid();
    this.currentDataService.usersAreLoaded$.subscribe((areLoaded) => {
      if (areLoaded) {
        this.allUsers = this.currentDataService.users;
      }
    });
  }

  deleteUserToChat(user: User) {
    const foundIndex = this.usersToChat.indexOf(user);
    this.usersToChat.splice(foundIndex, 1);
    this.currentDataService.setChatUsers(this.usersToChat);
  }

  async valuechange(newValue: any) {
    this.searchUsers = newValue;
  }

  addUser(user: User, input: HTMLInputElement) {
    if (!this.usersToChat.includes(user))
      this.validateUser(user, input);
    else
      this.pushupMessage.openPushupMessage('error', 'User is already in the chat');
  }

  toggleLeftSidebar() {
    this.leftSideBar = !this.leftSideBar;
    this.navService.workspaceBar.toggle();
  }

  isChatWithMeAndOthers(user: User) {
    return this.usersToChat.length > 0 && user.id === this.currentUserId;
  }

  validateUser(user: User, input: HTMLInputElement) {
    if (this.isChatWithMeAndOthers(user))
      this.pushupMessage.openPushupMessage('error', 'Unfortunately, you cannot talk with someone and yourself');
    else
      this.addValidUser(user, input);
  }

  addValidUser(user: User, input: HTMLInputElement) {
    this.usersToChat.push(user);
    this.currentDataService.setChatUsers(this.usersToChat);
    input.value = '';
    this.searchUsers = '';
  }

}
