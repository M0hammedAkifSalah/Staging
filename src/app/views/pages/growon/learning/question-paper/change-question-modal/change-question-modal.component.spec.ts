import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeQuestionModalComponent } from './change-question-modal.component';

describe('ChangeQuestionModalComponent', () => {
  let component: ChangeQuestionModalComponent;
  let fixture: ComponentFixture<ChangeQuestionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeQuestionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeQuestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
