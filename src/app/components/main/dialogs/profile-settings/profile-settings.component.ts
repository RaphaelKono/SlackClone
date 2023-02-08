import { Component, ElementRef, ViewChild } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, StorageReference } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {

  @ViewChild('phone') phone?: ElementRef


  step = -1;

  public statusValue: any = '';

  file: any = {};
  path = '';
  storageRef!: StorageReference;
  currentUser: User = new User();

  username = new FormGroup({
    username: new FormControl(this.currentUser.name, [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private firestoreService: FirestoreService,
    private pushupMessage: PushupMessageService,
    private fireStorage: Storage,
    private dialogRef: MatDialogRef<ProfileSettingsComponent>,
    public userService: UserService,
    private formErrorService: FormErrorService) {
    this.statusValue = this.userService.currentUser.status;
  }

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
  }

  setStep(index: number) {
    if (this.step == index) {
      this.step = -1;
    } else {
      this.step = index;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateUserData() {
    this.firestoreService.updateUser(this.userService.get().toJson());
  }

  updateUserName() {
    if (this.username.valid) {
      let username = this.username.value.username;
      this.userService.currentUser.name = username!;
      this.updateUserData();
    }
  }

  updatePhone() {
    const phone = this.phone!.nativeElement.value;
    this.userService.currentUser.phone = phone!
    this.updateUserData();
  }

  updateStatus() {
    this.userService.currentUser.status = this.statusValue;
    this.updateUserData();
  }

  handleClick($event: EmojiEvent) {
    this.statusValue += $event.emoji.native;
  }

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.formErrorService.getMessage(formGroup, formControlName)
  }

  upload = ($event: any) => {
    if (!this.proofFile($event)) return
    const uploadTask = this.prepareUpload();
    uploadTask.on('state_changed', (snapshot) => {
      this.processUpload(snapshot);
    },
      (error) => this.pushupMessage.openPushupMessage('error', error.message),
      () => this.getDownloadLink(uploadTask));
  }

  getDownloadLink(uploadTask: any) {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      this.userService.currentUser.src = downloadURL;
      this.updateUserData();
      this.pushupMessage.openPushupMessage('success', 'Upload success');
    });
  }

  processUpload(snapshot: any) {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    switch (snapshot.state) {
      case 'canceled':
        this.pushupMessage.openPushupMessage('error', 'Upload is canceled');
        break;
      case 'running':
        this.pushupMessage.openPushupMessage('info', 'Upload is running' + progress + '%')
        break;
    }
  }

  proofFile($event: any) {
    this.file = $event.target.files[0];
    if (this.file.size > 3000000) {
      this.pushupMessage.openPushupMessage('error', 'Your upload is too large, select a file smaller than 3 MB!');
      return false;
    }
    return true;
  }

  prepareUpload() {
    const randomId = Math.random().toString(36).substring(2);
    this.path = `images/${randomId}`;
    this.storageRef = ref(this.fireStorage, this.path);
    return uploadBytesResumable(this.storageRef, this.file);
  }
}