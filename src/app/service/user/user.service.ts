import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public uid: any;
  public currentUser = new User();
  FIVE_MINUTES = 300000;

  constructor() { }

  set(obj: any) {
    this.currentUser.id = obj.id;
    this.currentUser.name = obj.name;
    this.currentUser.mail = obj.mail;
    this.currentUser.phone = obj.phone;
    this.currentUser.src = obj.src;
    this.currentUser.status = obj.status;
    this.currentUser.lastLogin = obj.lastLogin;
  }

  get() {
    return this.currentUser;
  }

  getUid() {
    return this.uid;
  }

  userState(user: User) {
    let lastLogin = user.lastLogin.getTime();
    let currentTime = new Date().getTime();
    let userActive: boolean;

    if (currentTime - lastLogin < this.FIVE_MINUTES) {
      userActive = true;
    } else {
      userActive = false;
    }
    return userActive
  }
}