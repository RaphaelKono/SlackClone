import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  workspaceBar: any;
  threadBar: any;
  threadBarIsInit: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private router: Router) { }

  setWorkspaceBar(workspaceBar: MatDrawer) {
    this.workspaceBar = workspaceBar;
  }

  setThreadBar(threadBar: MatDrawer) {
    this.threadBar = threadBar;
    this.threadBarIsInit.next(true);
  }

  navToRightBar(path: string, relation: ActivatedRoute | null) {
    this.threadBar.open();
    this.router.navigate([{ outlets: { right: path } }], { relativeTo: relation });
  }

  closeRightBar(relation: ActivatedRoute | null){
    this.threadBar.close();
    this.router.navigate([{ outlets: { right: null } }], { relativeTo: relation });
  }
}
