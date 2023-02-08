import { Injectable } from '@angular/core';
import { Thread } from 'src/app/models/thread.class';
import { SortService } from '../sort/sort.service';

@Injectable({
  providedIn: 'root'
})
export class QueryProcessService {

  constructor(private sortService: SortService) { }

/**
 * 
 * @param querySnapshot: QuerySnapshot
 * @param elemT: threadElement of querySnapshot-Array.
 * @returns sorted Threads by Date
 */
  processQuery(querySnapshot: any, unsortedThreads: Thread[]) {
    querySnapshot.forEach((doc: any) => {
      let elemT = new Thread(this.setThreadFromDoc(doc));
      let i = this.getElementIndex(elemT, unsortedThreads);
      if (i != -1)
        unsortedThreads.splice(i, 1, elemT);
      else
        unsortedThreads.push(elemT);
    });
    unsortedThreads = this.sortService.sortByDate(unsortedThreads);
    return [unsortedThreads,querySnapshot.docs[querySnapshot.docs.length - 1]];
  }

  setThreadFromDoc(doc: any) {
    let elemT: any = doc.data();
    elemT.id = doc.id;
    elemT.reactions = JSON.parse(elemT.reactions);
    return elemT;
  }

  getElementIndex(elemT: Thread, unsortedThreads: Thread[]) {
    return unsortedThreads.findIndex((thread: Thread) => thread.id === elemT.id);
  }
}
