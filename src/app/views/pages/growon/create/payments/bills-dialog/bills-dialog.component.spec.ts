import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsDialogComponent } from './bills-dialog.component';

describe('BillsDialogComponent', () => {
  let component: BillsDialogComponent;
  let fixture: ComponentFixture<BillsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
