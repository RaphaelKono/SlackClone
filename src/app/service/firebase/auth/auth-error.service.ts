import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorService {

  constructor() { }

  errorCode(code: string) {
    if (code == 'auth/email-already-in-use') return 'E-Mail address already exists';
    if (code == 'auth/weak-password') return 'Short Password length';
    if (code == 'auth/invalid-email') return 'E-Mail address isn\'t valid';
    if (code == 'auth/user-not-found') return 'User not found';
    if (code == 'auth/wrong-password') return 'Password incorrect';
    return 'Error unknown';
  }
}