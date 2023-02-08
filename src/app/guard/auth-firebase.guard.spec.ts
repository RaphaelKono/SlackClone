import { TestBed } from '@angular/core/testing';

import { AuthFirebaseGuard } from './auth-firebase.guard';

describe('AuthFirebaseGuard', () => {
  let guard: AuthFirebaseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthFirebaseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
