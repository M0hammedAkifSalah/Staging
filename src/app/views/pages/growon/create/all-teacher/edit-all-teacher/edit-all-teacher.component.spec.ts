import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAllTeacherComponent } from './edit-all-teacher.component';

describe('EditAllTeacherComponent', () => {
  let component: EditAllTeacherComponent;
  let fixture: ComponentFixture<EditAllTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAllTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAllTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
