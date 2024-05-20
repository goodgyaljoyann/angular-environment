import { TestBed } from '@angular/core/testing';

import { AppointmentServicesService } from './appointment-services.service';

describe('AppointmentServicesService', () => {
  let service: AppointmentServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
