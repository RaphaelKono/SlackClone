import { TestBed } from '@angular/core/testing';

import { QueryProcessService } from './query-process.service';

describe('QueryProcessService', () => {
  let service: QueryProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
