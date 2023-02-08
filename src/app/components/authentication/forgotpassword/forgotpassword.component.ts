import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';
import { AuthService } from 'src/app/service/firebase/auth/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class ForgotpasswordComponent {
  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private authService: AuthService, private formErrorService: FormErrorService) { }

  reset() {
    if (this.user.valid) {
      const email = this.user.value.email!;
      this.authService.sendPasswordResetEmail(email)
    }
  }

  getErrorMessage(formControlName: string) {
    return this.formErrorService.getMessage(this.user, formControlName)
  }
}