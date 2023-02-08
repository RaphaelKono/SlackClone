import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { NavigationService } from 'src/app/service/navigation/navigation.service';
import { DialogReactionComponent } from '../../dialogs/dialog-reaction/dialog-reaction.component';
import { OpenboxComponent } from '../../dialogs/openbox/openbox.component';

@Component({
  selector: 'app-template-chatroom',
  templateUrl: './template-chatroom.component.html',
  styleUrls: ['./template-chatroom.component.scss']
})
export class TemplateChatroomComponent {

  @Input() data: {
    collPath: string,
    threads: Thread[],
    currentUser: User,
    channelId: string,
    isFirstLoaded: boolean
  } = {
      collPath: '',
      threads: [],
      currentUser: new User(),
      channelId: '',
      isFirstLoaded: true
    }

  leftSideBar: boolean = false;
  isGoToThreadHovered = false;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(
    public dialog: MatDialog,
    public navService: NavigationService,
    public route: ActivatedRoute,
    public fireService: FirestoreService,
    public currentDataService: CurrentDataService) { }

  isInChannel() {
    return !this.data.collPath.includes('commentCollection') && !this.data.collPath.includes('bookmarks') ? true : false;
  }


  ngAfterViewChecked() {
    if (this.data.isFirstLoaded) {
      this.scrollToBottom();
    }
  }

  scrolled(): void {
    this.data.isFirstLoaded = false;
  }

  private scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  openThread(thread: any) {
    this.currentDataService.setThread(thread);
    this.navService.navToRightBar(this.data.channelId + '/' + thread.id, this.route.parent);
  }

  evaluateThread(emoji: string, t: number) {
    if (this.data.threads[t].getEmojiCount(this.data.currentUser.id) > 2 && !this.data.threads[t].isEmojiAlreadyByMe(emoji, this.data.currentUser.id))
      this.openTooManyDialog();
    else {
      this.setReaction(emoji, t);
    }
  }


  openTooManyDialog(): void {
    this.dialog.open(DialogReactionComponent);
  }

  setReaction(emoji: string, t: number) {
    this.data.threads[t].evaluateThreadCases(emoji, this.data.currentUser.id);
    this.fireService.save(this.data.threads[t], this.data.collPath, this.data.threads[t].id);
  }


  openBox(url: string) {
    let dialog = this.dialog.open(OpenboxComponent);
    dialog.componentInstance.openboxImg = url;
  }

  async addBookmark(thread: Thread) {
    const docSnap = await this.fireService.getDocumentSnap("users/" + this.data.currentUser.id + '/bookmarks/' + thread.id);
    if (!docSnap.exists())
      await this.saveBookmark(thread);
    else
      this.fireService.deleteDocument('users/' + this.data.currentUser.id + '/bookmarks', thread.id);
  }

  async saveBookmark(thread: Thread) {
    await this.fireService.save(thread, 'users/' + this.data.currentUser.id + '/bookmarks', thread.id);
    this.navService.navToRightBar('bookmarks', this.route.parent);
  }

  async deleteBookmark(deleteBookmarkID: string) {
    this.data.threads.splice(this.data.threads.findIndex((bookmark) => bookmark.id === deleteBookmarkID), 1);
    this.fireService.deleteDocument('users/' + this.data.currentUser.id + '/bookmarks', deleteBookmarkID);
    this.navService.navToRightBar('bookmarks', this.route.parent);
  }

}
