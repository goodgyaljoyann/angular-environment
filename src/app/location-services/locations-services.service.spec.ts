import { TestBed } from '@angular/core/testing';

import { LocationsServService } from './locations-services.service';

describe('LocationsServService', () => {
  let service: LocationsServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationsServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
