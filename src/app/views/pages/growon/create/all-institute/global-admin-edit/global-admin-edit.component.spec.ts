import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAdminEditComponent } from './global-admin-edit.component';

describe('GlobalAdminEditComponent', () => {
  let component: GlobalAdminEditComponent;
  let fixture: ComponentFixture<GlobalAdminEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalAdminEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalAdminEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
