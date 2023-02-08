import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/firebase/auth/auth.service';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { User } from 'src/app/models/user.class';
import { UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class RegistrationComponent {
  user = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    acceptTerms: new FormControl(false, [Validators.requiredTrue])
  });
  hide = true;

  newUser = new User();
  usernameNewUser!: string;

  channelsForNewUser: string[] = [
    '5hLrjtfk9DLbnnhb0eYt', // Channel Angular
    'YR2mU8YFwcvJOctTnWvX', // Channel JavaScript
    'kodrdqttATIub86aDGfN', // Channel Community
    'nv5UkF7fatJpGwnpMaV3', // Channel HTML-CSS
    'obQbIgSkigikiUjoUAg6', // Channel Allgemein
    'vBN6AQ9viyozGCrqMJGJ', // Channel Bewerbung
  ];

  constructor(private authService: AuthService, private formErrorService: FormErrorService, private firestoreService: FirestoreService) { }

  async register() {
    if (this.user.valid) {
      const email = this.user.value.email!;
      const password = this.user.value.password!;
      await this.authService.createUserWithEmailAndPassword(email, password);
      let user = this.authService.userCredential;
      this.saveNewUser(user);
      this.addUserToDefaultChannels(user);
    }
  }

  saveNewUser(user: UserCredential) {
    this.newUser.id = user.user.uid;
    this.newUser.mail = user.user.email!;
    this.newUser.name = this.user.value.username!;
    this.newUser.lastLogin = new Date();
    this.firestoreService.save(this.newUser, 'users', this.newUser.id)
  }

  addUserToDefaultChannels(user: UserCredential) {
    this.channelsForNewUser.forEach((channelID) => {
      this.firestoreService.pushUserToChannel(channelID, user.user.uid)
    })
  }

  getErrorMessage(formControlName: string) {
    return this.formErrorService.getMessage(this.user, formControlName)
  }
}