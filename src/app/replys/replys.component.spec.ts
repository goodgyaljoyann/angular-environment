import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplysComponent } from './replys.component';

describe('ReplysComponent', () => {
  let component: ReplysComponent;
  let fixture: ComponentFixture<ReplysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
