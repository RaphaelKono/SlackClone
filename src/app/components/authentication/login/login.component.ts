import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/firebase/auth/auth.service';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class LoginComponent {
  hide = true;
  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  guest = {
    email: 'slackcloneguest-20230208-1900@konopatzki.info',
    password: 'dwDrNG!fd78C'
  }

  constructor(private authService: AuthService, private formErrorService: FormErrorService) { }

  loginAsGuest() {
    this.authService.login(this.guest.email, this.guest.password);
  }

  loginAsUser() {
    if (this.user.valid) {
      const email = this.user.value.email!;
      const password = this.user.value.password!;
      this.authService.login(email, password);
    }
  }

  getErrorMessage(formControlName: string) {
    return this.formErrorService.getMessage(this.user, formControlName)
  }
}