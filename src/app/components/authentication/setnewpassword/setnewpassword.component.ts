import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';
import { AuthService } from 'src/app/service/firebase/auth/auth.service';

@Component({
  selector: 'app-setnewpassword',
  templateUrl: './setnewpassword.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class SetnewpasswordComponent {
  user = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  hide = true;
  routeData: any;

  constructor(private authService: AuthService,
    private formErrorService: FormErrorService,
    private pushupMessage: PushupMessageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'resetPassword') {
        this.routeData = params;
      }
      if (params['mode'] === 'verifyEmail' || params['mode'] === 'recoverEmail') {
        const oobCode = params['oobCode']
        this.authService.applyActionCode(oobCode)
        this.router.navigate(['/login']);
        this.pushupMessage.openPushupMessage('success', 'Verification successful')
      }
    });
  }

  setNewPassword() {
    if (this.user.valid) {
      const password = this.user.value.password!;
      const oobCode = this.routeData['oobCode']
      this.authService.confirmPasswordReset(oobCode, password)
    }
  }

  getErrorMessage(formControlName: string) {
    return this.formErrorService.getMessage(this.user, formControlName)
  }
}