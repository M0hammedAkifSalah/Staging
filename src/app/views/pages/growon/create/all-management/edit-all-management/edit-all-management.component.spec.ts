import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAllManagementComponent } from './edit-all-management.component';

describe('EditAllManagementComponent', () => {
  let component: EditAllManagementComponent;
  let fixture: ComponentFixture<EditAllManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAllManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAllManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
