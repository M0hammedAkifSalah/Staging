import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectsComponent } from './add-subjects.component';

describe('AddSubjectsComponent', () => {
  let component: AddSubjectsComponent;
  let fixture: ComponentFixture<AddSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
