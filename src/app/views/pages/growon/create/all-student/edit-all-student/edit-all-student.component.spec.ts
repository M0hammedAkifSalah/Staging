import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAllStudentComponent } from './edit-all-student.component';

describe('EditAllStudentComponent', () => {
  let component: EditAllStudentComponent;
  let fixture: ComponentFixture<EditAllStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAllStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAllStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
