import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleModalComponent } from './update-role-modal.component';

describe('UpdateRoleModalComponent', () => {
  let component: UpdateRoleModalComponent;
  let fixture: ComponentFixture<UpdateRoleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRoleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
