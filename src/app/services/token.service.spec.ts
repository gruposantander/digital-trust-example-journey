import { TestBed } from '@angular/core/testing';

import { SDKService } from './sdk.service';

describe('TokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SDKService = TestBed.get(SDKService);
    expect(service).toBeTruthy();
  });
});
