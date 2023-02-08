import { Injectable } from '@angular/core';
import { Auth, signOut, UserCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, confirmPasswordReset, applyActionCode, updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CurrentDataService } from '../../current-data/current-data.service';
import { PushupMessageService } from '../../pushup-message/pushup-message.service';
import { UserService } from '../../user/user.service';
import { AuthErrorService } from './auth-error.service';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userCredential!: UserCredential;
  currentUserId?: string;

  constructor(
    private auth: Auth,
    private router: Router,
    private userService: UserService,
    private currentDataService: CurrentDataService,
    private pushupMessage: PushupMessageService,
    private authError: AuthErrorService,
    private firestoreService: FirestoreService
  ) { }

  setUid() {
    this.currentUserId = this.auth.currentUser?.uid;
    this.userService.uid = this.auth.currentUser?.uid;
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password!)
      .then((user: UserCredential) => {
        if (user.user?.emailVerified) {
          this.router.navigate(['/client']);
          this.pushupMessage.openPushupMessage('success', 'Login Successfully')
        } else {
          this.router.navigate(['/verification']);
          this.pushupMessage.openPushupMessage('info', 'Please verify your E-Mail Address')
        }
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async logout() {
    this.currentDataService.clearByLogout()
    await signOut(this.auth)
      .then(() => {
        this.pushupMessage.openPushupMessage('success', 'Logout successfully')
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((user: UserCredential) => {
        this.sendEmailVerification(user);
        this.userCredential = user;
      })
      .catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async sendEmailVerification(user: UserCredential) {
    await sendEmailVerification(user.user)
      .then(() => {
        this.router.navigate(['/verification']);
        this.pushupMessage.openPushupMessage('info', 'Check your E-Mail Account')
      });
  }

  async sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.router.navigate(['/login']);
        this.pushupMessage.openPushupMessage('success', 'Check your E-Mail Account');
      })
      .catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async confirmPasswordReset(oobCode: string, password: string) {
    await confirmPasswordReset(this.auth, oobCode, password!)
      .then(() => {
        this.router.navigate(['/login']);
        this.pushupMessage.openPushupMessage('success', 'Password change successful')
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async applyActionCode(oobCode: string) {
    await applyActionCode(this.auth, oobCode)
  }

  async updateEmail(email: string) {
    await updateEmail(this.auth.currentUser!, email)
      .then(() => {
        this.userService.currentUser.mail = email!;
        this.updateUserData();
        sendEmailVerification(this.auth.currentUser!)
        this.pushupMessage.openPushupMessage('success', 'Please verify your new email')
        this.logout();
      })
      .catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async updatePassword(password: string) {
    await updatePassword(this.auth.currentUser!, password)
      .then(() => {
        this.pushupMessage.openPushupMessage('success', 'Update password successfully')
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async deleteUser() {
    this.currentDataService.clearByLogout();
    await this.firestoreService.deleteDocument('users', this.currentUserId!);
    await deleteUser(this.auth.currentUser!)
      .then(() => {
        this.pushupMessage.openPushupMessage('success', 'Your account has been deleted')
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async reauthenticate(password: string) {
    const credential = EmailAuthProvider.credential(this.auth.currentUser!.email!, password!)
    await reauthenticateWithCredential(this.auth.currentUser!, credential)
      .catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async updateUserData() {
    await this.firestoreService.updateUser(this.userService.get().toJson());
  }
}