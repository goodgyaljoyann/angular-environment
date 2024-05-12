import { TestBed } from '@angular/core/testing';

import { CarServicesService } from './car-services.service';

describe('CarServicesService', () => {
  let service: CarServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
