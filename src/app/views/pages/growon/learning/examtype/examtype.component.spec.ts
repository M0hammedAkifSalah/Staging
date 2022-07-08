import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamtypeComponent } from './examtype.component';

describe('ExamtypeComponent', () => {
  let component: ExamtypeComponent;
  let fixture: ComponentFixture<ExamtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
