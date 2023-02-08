import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EMPTY, Observable } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { OpenboxComponent } from 'src/app/components/main/dialogs/openbox/openbox.component';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { SortService } from 'src/app/service/sort/sort.service';
import { UserService } from 'src/app/service/user/user.service';
import { DialogReactionComponent } from '../../../dialogs/dialog-reaction/dialog-reaction.component';
import { Channel } from 'src/app/models/channel.class';
import { DocumentData, onSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { QueryProcessService } from 'src/app/service/query-process/query-process.service';
import { NavigationService } from 'src/app/service/navigation/navigation.service';

@Component({
  selector: 'app-thread-bar',
  templateUrl: './thread-bar.component.html',
  styleUrls: ['./thread-bar.component.scss']
})
export class ThreadBarComponent {
  collData$: Observable<any> = EMPTY;
  threadDocData$: Observable<any> = EMPTY;
  channelDocData$: Observable<any> = EMPTY;
  collPath: string = '';
  channel: Channel = new Channel();
  channelId: string = '';
  thread = new Thread();
  threadId: string = '';
  comments: Thread[] = [];
  unsortedComments: Thread[] = [];
  currentUser = new User();
  lastLoadedComment!: QueryDocumentSnapshot<DocumentData>;
  isFirstLoad = true;
  moreToLoad = false;


  constructor(public route: ActivatedRoute, private fireService: FirestoreService, public currentDataService: CurrentDataService, public navService: NavigationService, private userService: UserService, private dialog: MatDialog, private queryProcessService: QueryProcessService) { }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.subscribeUrl();
    this.subscribeThreadbarInit();
    this.isFirstLoad = true;
  }

  subscribeUrl() {
    this.route.url.subscribe((params: any) => this.setCommentCollection(params));
  }

  setCommentCollection(params: any) {
    this.setChannelAndThreadId(params);
    this.getCollAndDoc();
    this.subscribeCollAndDoc();
  }

  setChannelAndThreadId(params: any) {
    this.channelId = params[0].path;
    this.threadId = params[1].path;
    this.comments = [];
    this.unsortedComments = [];
  }

  getCollAndDoc() {
    this.collPath = 'channels/' + this.channelId + '/ThreadCollection/' + this.threadId + '/commentCollection';
    this.threadDocData$ = this.fireService.getDocument(this.threadId, 'channels/' + this.channelId + '/ThreadCollection/');
    this.channelDocData$ = this.fireService.getDocument(this.channelId, 'channels/');
  }

  subscribeThreadbarInit() {
    this.navService.threadBarIsInit.subscribe(isLoaded => {
      if (isLoaded === true)
        this.navService.threadBar.open();
    });
  }

  subscribeCollAndDoc() {
    const subscription_thread = this.threadDocData$.subscribe((thread) => this.setThread(thread));
    const subscription_channel = this.channelDocData$.subscribe((channel) => this.setChannel(channel));
    this.currentDataService.subscription_arr.push(subscription_thread);
    this.currentDataService.subscription_arr.push(subscription_channel);
    this.snapShotThreadCollection();
  }

  setThread(thread: any) {
    thread.creationDate = thread.creationDate.toDate();
    thread.reactions = JSON.parse(thread.reactions);
    this.thread = new Thread(thread);
    this.currentDataService.setThread(thread);
  }

  setChannel(channel: any) {
    channel.channelId = channel.id;
    this.channel = new Channel(channel);
  }

  snapShotThreadCollection() {
    this.currentDataService.usersAreLoaded$.subscribe(areLoaded => {
      this.firstQuery(areLoaded)
    });
  }

  firstQuery(areLoaded: boolean) {
    if (areLoaded === true) {
      this.comments = [];
      this.unsortedComments = [];
      const q = this.fireService.getLimitedQuery(this.collPath);
      this.snapQuery(q);
    }
  }

  nextQuery() {
    const next = this.fireService.getNextLimitedQuery(this.collPath, this.lastLoadedComment);
    this.snapQuery(next);
  }

  snapQuery(q: Query) {
    const resp = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      [this.comments, this.lastLoadedComment] = this.queryProcessService.processQuery(querySnapshot, this.unsortedComments);
      this.isMoreToLoad();
    });
    this.currentDataService.snapshot_arr.push(resp);
  }

  openBox(url: string) {
    let dialog = this.dialog.open(OpenboxComponent);
    dialog.componentInstance.openboxImg = url;
  }

  isInChannel() {
    return this.channel.users.indexOf(this.currentUser.id) !== -1;
  }

  async isMoreToLoad() {
    this.moreToLoad = await this.fireService.isMoreToLoad(this.collPath, this.comments.length);
  }
}
