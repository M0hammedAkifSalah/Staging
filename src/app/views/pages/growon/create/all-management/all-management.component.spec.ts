import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllManagementComponent } from './all-management.component';

describe('AllManagementComponent', () => {
  let component: AllManagementComponent;
  let fixture: ComponentFixture<AllManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
