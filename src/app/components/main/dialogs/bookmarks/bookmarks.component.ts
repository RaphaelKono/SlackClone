import { Component } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent {

  
  link: string = '';
  linkName: string = '';
  currentChatroomID: string = '';

  constructor(public dialogRef: MatDialogRef<BookmarksComponent>, private firestore: Firestore) { }

  async addBookmark(){
    await addDoc(collection(this.firestore, "channels", this.currentChatroomID, 'bookmarks' ), {
      name: this.linkName,
      link: this.link,
    });
    this.dialogRef.close();
  }
}