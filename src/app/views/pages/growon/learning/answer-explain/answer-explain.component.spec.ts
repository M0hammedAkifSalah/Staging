import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerExplainComponent } from './answer-explain.component';

describe('AnswerExplainComponent', () => {
  let component: AnswerExplainComponent;
  let fixture: ComponentFixture<AnswerExplainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerExplainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerExplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
