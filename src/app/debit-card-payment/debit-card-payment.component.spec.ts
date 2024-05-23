import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitCardPaymentComponent } from './debit-card-payment.component';

describe('DebitCardPaymentComponent', () => {
  let component: DebitCardPaymentComponent;
  let fixture: ComponentFixture<DebitCardPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitCardPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitCardPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
