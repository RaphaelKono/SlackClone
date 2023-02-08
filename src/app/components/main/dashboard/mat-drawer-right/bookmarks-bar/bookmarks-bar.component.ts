import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { UserService } from 'src/app/service/user/user.service';
import { Channel } from 'src/app/models/channel.class';
import { DocumentData, onSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { QueryProcessService } from 'src/app/service/query-process/query-process.service';
import { NavigationService } from 'src/app/service/navigation/navigation.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks-bar.component.html',
  styleUrls: ['./bookmarks-bar.component.scss']
})
export class BookmarksBarComponent {
  collData$: Observable<any> = EMPTY;
  threadDocData$: Observable<any> = EMPTY;
  channelDocData$: Observable<any> = EMPTY;
  collPath: string = '';
  channel: Channel = new Channel();
  channelId: string = '';
  thread = new Thread();
  threadId: string = '';
  bookmarks: Thread[] = [];
  unsortedBookmarks: Thread[] = [];
  currentUser = new User();
  lastLoadedBookmark!: QueryDocumentSnapshot<DocumentData>;
  isFirstLoad = true;

  constructor(public route: ActivatedRoute, private fireService: FirestoreService, public currentDataService: CurrentDataService, public navService: NavigationService, private userService: UserService, private queryProcessService: QueryProcessService) { }


  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.setCommentCollection();
    this.subscribeThreadbarInit();
    this.isFirstLoad = true;
  }

  setCommentCollection() {
    this.getCollAndDoc();
    this.snapShotThreadCollection();
  }

  async getCollAndDoc() {
    this.collPath = 'users/' + this.userService.getUid() + '/bookmarks';
  }

  subscribeThreadbarInit() {
    this.navService.threadBarIsInit.subscribe(isLoaded => {
      if (isLoaded === true)
        this.navService.threadBar.open();
    });
  }

  snapShotThreadCollection() {
    this.currentDataService.usersAreLoaded$.subscribe(areLoaded => {
      this.firstQuery(areLoaded)
    });
  }

  firstQuery(areLoaded: boolean) {
    if (areLoaded === true) {
      this.bookmarks = [];
      this.unsortedBookmarks = [];
      const q = this.fireService.getLimitedQuery(this.collPath);
      this.snapQuery(q);
    }
  }

  snapQuery(q: Query) {
    const resp = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      [this.bookmarks, this.lastLoadedBookmark] = this.queryProcessService.processQuery(querySnapshot, this.unsortedBookmarks);
    });
    this.currentDataService.snapshot_arr.push(resp);
  }

}
