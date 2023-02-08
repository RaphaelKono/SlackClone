import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../service/firebase/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router, private ngZone: NgZone, private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged(user => {
        if (!user) {
          this.ngZone.run(() => this.router.navigate(['/login']));
          resolve(false);
        } else {
          this.authService.setUid();
          resolve(true);
        }
      });
    });
  }
}