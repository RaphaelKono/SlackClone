import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { EMPTY, Observable } from 'rxjs';
import { collection, deleteDoc, doc, DocumentData, Firestore, onSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { SortService } from 'src/app/service/sort/sort.service';
import { Channel } from 'src/app/models/channel.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/service/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { OpenboxComponent } from 'src/app/components/main/dialogs/openbox/openbox.component';
import { DialogReactionComponent } from '../../../dialogs/dialog-reaction/dialog-reaction.component';
import { BookmarksComponent } from '../../../dialogs/bookmarks/bookmarks.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DialogChannelInfoComponent } from '../../../dialogs/dialog-channel-info/dialog-channel-info.component';
import { DialogAddMemberComponent } from '../../../dialogs/dialog-add-member/dialog-add-member.component';
import { QueryProcessService } from 'src/app/service/query-process/query-process.service';
import { NavigationService } from 'src/app/service/navigation/navigation.service';


@Component({
  selector: 'app-channel-bar',
  templateUrl: './channel-bar.component.html',
  styleUrls: ['./channel-bar.component.scss']
})
export class ChannelBarComponent {
  leftSideBar: boolean = false;
  isGoToThreadHovered = false;
  channelId: string = '';
  collData$: Observable<any> = EMPTY;
  collPath: string = '';
  threads: Thread[] = [];
  channel = new Channel();
  currentUser: User = new User();
  isFirstLoad = true;
  channelName: string = '';
  channel$: Observable<any> = EMPTY;
  shownUsers: string = '';
  lastLoadedThread!: QueryDocumentSnapshot<DocumentData>;
  unsortedThreads: Thread[] = [];
  bookmarks: any[] = [];
  moreToLoad = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public dialog: MatDialog, public navService: NavigationService, public route: ActivatedRoute, public fireService: FirestoreService, private router: Router, public currentDataService: CurrentDataService, private firestore: Firestore, private userService: UserService, media: MediaMatcher, changeDetectorRef: ChangeDetectorRef, private queryProcessService: QueryProcessService) {
    this.mobileQuery = media.matchMedia('(max-width: 360px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.route.params.subscribe((param: any) => this.initParams(param));
  }

  initParams(param: { id: string }) {
    this.threads = [];
    this.unsortedThreads = [];
    this.channelId = param.id;
    this.collPath = 'channels/' + param.id + '/ThreadCollection';
    this.snapShotThreadCollection();
    this.isFirstLoad = true;
    this.loadBookmarks();
  }

  snapShotThreadCollection() {
    this.currentDataService.usersAreLoaded$.subscribe(areLoaded => {
      if (areLoaded) {
        this.subscribeChannelDoc();
        this.firstQuery();
      }
    });
  }

  firstQuery() {
    this.threads = [];
    this.unsortedThreads = [];
    const q = this.fireService.getLimitedQuery(this.collPath);
    this.snapQuery(q);
  }

  nextQuery() {
    const next = this.fireService.getNextLimitedQuery(this.collPath, this.lastLoadedThread);
    this.snapQuery(next);
  }

  snapQuery(q: Query) {
    const resp = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      [this.threads, this.lastLoadedThread] = this.queryProcessService.processQuery(querySnapshot, this.unsortedThreads);
      this.isMoreToLoad();
    });
    this.currentDataService.snapshot_arr.push(resp);
  }

  subscribeChannelDoc() {
    this.channel$ = this.fireService.getDocument(this.channelId, 'channels');
    const subscription = this.channel$.subscribe((channel: any) => this.setChannel(channel));
    this.currentDataService.subscription_arr.push(subscription);
  }

  setChannel(channel: any) {
    channel.creationDate = channel.creationDate.toDate();
    channel.channelId = channel.id;
    this.channel = new Channel(channel);
  }

  async loadBookmarks() {
    const bookmarksRef = collection(this.firestore, 'channels/' + this.channelId, 'bookmarks');
    const resp = onSnapshot(bookmarksRef, async (bookmarksDocs) => this.snapBookmarks(bookmarksDocs));
    this.currentDataService.snapshot_arr.push(resp);
  }

  snapBookmarks(bookmarksDocs: any) {
    this.bookmarks = [];
    bookmarksDocs.forEach((doc: any) => {
      let bookmarkData = {
        link: '',
        name: '',
        id: '',
      }
      bookmarkData.link = doc.data().link;
      bookmarkData.name = doc.data().name;
      bookmarkData.id = doc.id;
      this.bookmarks.push(bookmarkData);
    })
  }

  openBookmarks(channelID: string) {
    let dialog = this.dialog.open(BookmarksComponent);
    dialog.componentInstance.currentChatroomID = channelID;
  }

  async deleteBookmark(deleteBookmarkID: string) {
    this.fireService.deleteDocument('channels/' + this.channelId + '/bookmarks', deleteBookmarkID);
  }


  isInChannel() {
    return this.channel.users.indexOf(this.currentUser.id) !== -1;
  }

  joinChannel() {
    if (!this.channel.users.includes(this.currentUser.id)) {
      this.channel.users.push(this.currentUser.id);
      this.fireService.pushUserToChannel(this.channelId, this.currentUser.id);
    }
  }

  openDialogChannelInfo(tabNo: number) {
    const dialogRef = this.dialog.open(DialogChannelInfoComponent, {
      data: {
        channel: this.channel,
        tab: tabNo
      }
    });
    dialogRef.afterClosed().subscribe(result => this.navigateAfterClosed(result));
  }

  /**
   * 
   * @param result: 'left' means that user left Channel. Otherwise result is that user clicked on profile-id of a member to watch profile
   */
  navigateAfterClosed(result: string) {
    if (result == 'left')
      this.router.navigateByUrl('client');
    else if (result)
      this.navService.navToRightBar('profile/' + result, this.route.parent);
  }

  openAddMember() {
    this.dialog.open(DialogAddMemberComponent, {
      data: {
        channel: this.channel,
      }
    });
  }

  async isMoreToLoad() {
    this.moreToLoad = await this.fireService.isMoreToLoad(this.collPath, this.threads.length);
  }

  toggleLeftSidebar() {
    this.leftSideBar = !this.leftSideBar;
    this.navService.workspaceBar.toggle();
  }
}
