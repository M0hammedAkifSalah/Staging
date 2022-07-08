import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConfirmationComponent } from './print-confirmation.component';

describe('PrintConfirmationComponent', () => {
  let component: PrintConfirmationComponent;
  let fixture: ComponentFixture<PrintConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
