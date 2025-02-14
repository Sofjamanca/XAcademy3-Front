import { TestBed } from '@angular/core/testing';

import { AuthStateServiceService } from './auth-state-service.service';

describe('AuthStateServiceService', () => {
  let service: AuthStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
