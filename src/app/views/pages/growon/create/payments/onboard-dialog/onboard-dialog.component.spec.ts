import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardDialogComponent } from './onboard-dialog.component';

describe('OnboardDialogComponent', () => {
  let component: OnboardDialogComponent;
  let fixture: ComponentFixture<OnboardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
