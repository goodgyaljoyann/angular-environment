import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesControlsComponent } from './services-controls.component';

describe('ServicesControlsComponent', () => {
  let component: ServicesControlsComponent;
  let fixture: ComponentFixture<ServicesControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
