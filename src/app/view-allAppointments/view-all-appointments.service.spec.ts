import { TestBed } from '@angular/core/testing';

import { ViewAllAppointmentsService } from './view-all-appointments.service';

describe('ViewAllAppointmentsService', () => {
  let service: ViewAllAppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewAllAppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
