import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import { environment } from 'src/environment/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';


// Components
import { ImprintComponent } from './components/imprint/imprint.component';
import { DataprotectionComponent } from './components/dataprotection/dataprotection.component';

// Authentication Components
import { LoginComponent } from './components/authentication/login/login.component';
import { ForgotpasswordComponent } from './components/authentication/forgotpassword/forgotpassword.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { SetnewpasswordComponent } from './components/authentication/setnewpassword/setnewpassword.component';
import { VerifyuserComponent } from './components/authentication/verifyuser/verifyuser.component';

// Main Components
import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/main/dashboard/dashboard.component';
import { WorkspaceBarComponent } from './components/main/dashboard/mat-drawer-left/workspace-bar/workspace-bar.component';
import { DialogAddChannelComponent } from './components/main/dialogs/dialog-add-channel/dialog-add-channel.component';

// Ng Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

//Emoijs
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive'

import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DashboardHeaderComponent } from './components/main/dashboard/dashboard-header/dashboard-header.component';
import { ReauthenticateComponent } from './components/main/dialogs/reauthenticate/reauthenticate.component';
import { ImgSrcPipe } from './pipes/imgSrc/img-src.pipe';
import { UsernamePipe } from './pipes/username/username.pipe';
import { DialogReactionComponent } from './components/main/dialogs/dialog-reaction/dialog-reaction.component';
import { DatePipe } from './pipes/date/date.pipe';
import { OpenboxComponent } from './components/main/dialogs/openbox/openbox.component';
import { MessagePartnerPipe } from './pipes/message-partner/message-partner.pipe';
import { PeriodOfTimePipe } from './pipes/date/period-of-time.pipe';
import { CanClickPipe } from './pipes/canClick/can-click.pipe';
import { ThreadBarComponent } from './components/main/dashboard/mat-drawer-right/thread-bar/thread-bar.component';
import { ChannelBarComponent } from './components/main/dashboard/mat-drawer-content/channel-bar/channel-bar.component';
import { NewMessageComponent } from './components/main/dashboard/mat-drawer-content/new-message/new-message.component';
import { InfocardComponent } from './components/main/dashboard/mat-drawer-right/infocard/infocard.component';
import { MessageEditorComponent } from './components/main/dashboard/message-editor/message-editor.component';
import { AccountSettingsComponent } from './components/main/dialogs/account-settings/account-settings.component';
import { ProfileSettingsComponent } from './components/main/dialogs/profile-settings/profile-settings.component';
import { AllChannelsComponent } from './components/main/dashboard/mat-drawer-content/all-channels/all-channels.component';
import { BookmarksComponent } from './components/main/dialogs/bookmarks/bookmarks.component';
import { BookmarksBarComponent } from './components/main/dashboard/mat-drawer-right/bookmarks-bar/bookmarks-bar.component';
import { DialogChannelInfoComponent } from './components/main/dialogs/dialog-channel-info/dialog-channel-info.component';
import { DialogEditChannelComponent } from './components/main/dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogAddMemberComponent } from './components/main/dialogs/dialog-add-member/dialog-add-member.component';
import { DialogNoFunctionComponent } from './components/main/dialogs/dialog-no-function/dialog-no-function.component';
import { TemplateChatroomComponent } from './components/main/dashboard/template-chatroom/template-chatroom.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    ForgotpasswordComponent,
    RegistrationComponent,
    SetnewpasswordComponent,
    VerifyuserComponent,
    ImprintComponent,
    DataprotectionComponent,
    DashboardComponent,
    WorkspaceBarComponent,
    ThreadBarComponent,
    ChannelBarComponent,
    DialogAddChannelComponent,
    ClickStopPropagationDirective,
    InfocardComponent,
    DashboardHeaderComponent,
    ReauthenticateComponent,
    ImgSrcPipe,
    UsernamePipe,
    DialogReactionComponent,
    DatePipe,
    OpenboxComponent,
    NewMessageComponent,
    MessagePartnerPipe,
    PeriodOfTimePipe,
    CanClickPipe,
    MessageEditorComponent,
    AccountSettingsComponent,
    ProfileSettingsComponent,
    AllChannelsComponent,
    BookmarksComponent,
    BookmarksBarComponent,
    DialogChannelInfoComponent,
    DialogEditChannelComponent,
    DialogAddMemberComponent,
    DialogNoFunctionComponent,
    TemplateChatroomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatMenuModule,
    PickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule,
    AngularEditorModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
