import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeacherModalComponent } from './update-teacher-modal.component';

describe('UpdateTeacherModalComponent', () => {
  let component: UpdateTeacherModalComponent;
  let fixture: ComponentFixture<UpdateTeacherModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTeacherModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTeacherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
