import { Component } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  users$: Observable<any> = EMPTY;
  updateLastLoginTime: number = 300000; //300000 = 5 min
  users: User[] = [];

  constructor(private firestoreService: FirestoreService, private currentDataService: CurrentDataService) { }

  ngOnInit(): void {
    this.users$ = this.firestoreService.getCollection('users');
    const subscription = this.users$.subscribe((users) => this.setUsers(users));
    this.currentDataService.subscription_arr.push(subscription);
    this.updateLastLogin();
    const interval = setInterval(() => this.updateLastLogin(), this.updateLastLoginTime);
    this.currentDataService.interval_arr.push(interval);
  }

  setUsers(users: any) {
    this.users = [];
    users.forEach((user: any) => {
      user.lastLogin = user.lastLogin.toDate();
      console.log(user);
      this.users.push(user);
    });
    this.currentDataService.setUsers(this.users);
  }

  updateLastLogin() {
    this.firestoreService.updateLastLogin(new Date())
  }
}