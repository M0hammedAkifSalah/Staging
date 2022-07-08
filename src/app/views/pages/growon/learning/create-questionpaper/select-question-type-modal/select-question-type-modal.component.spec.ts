import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuestionTypeModalComponent } from './select-question-type-modal.component';

describe('SelectQuestionTypeModalComponent', () => {
  let component: SelectQuestionTypeModalComponent;
  let fixture: ComponentFixture<SelectQuestionTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectQuestionTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectQuestionTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
