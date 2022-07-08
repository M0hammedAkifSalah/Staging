import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateBillingComponent } from './activate-billing.component';

describe('ActivateBillingComponent', () => {
  let component: ActivateBillingComponent;
  let fixture: ComponentFixture<ActivateBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
