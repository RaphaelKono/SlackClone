import { TestBed } from '@angular/core/testing';

import { PushupMessageService } from './pushup-message.service';

describe('PushupMessageService', () => {
  let service: PushupMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushupMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
