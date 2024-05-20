import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsControlsComponent } from './products-controls.component';

describe('ProductsControlsComponent', () => {
  let component: ProductsControlsComponent;
  let fixture: ComponentFixture<ProductsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
