import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavigationService } from 'src/app/service/navigation/navigation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  mobileQuery: MediaQueryList;

  @ViewChild('workspaceBar') workspaceBar: any;
  @ViewChild('threadBar') threadBar: any;

  private _mobileQueryListener: () => void;

  constructor(public createChannelService: FirestoreService, public navService: NavigationService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngAfterViewInit() {
    this.navService.setWorkspaceBar(this.workspaceBar);
    setTimeout(() => this.navService.setThreadBar(this.threadBar), 0);
  }

  toggleMode() {
    let side: MatDrawerMode = 'side'
    let over: MatDrawerMode = 'over'
    return (window.innerWidth >= 1000) ? side : over
  }

  toggleLeftSidebar() {
    this.workspaceBar.toggle();
  }
}
