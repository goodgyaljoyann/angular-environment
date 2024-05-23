import { TestBed } from '@angular/core/testing';

import { PaymentsServicesService } from './payments-services.service';

describe('PaymentsServicesService', () => {
  let service: PaymentsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
