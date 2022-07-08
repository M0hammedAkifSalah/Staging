import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionPaperModuleComponent } from './create-question-paper-module.component';

describe('CreateQuestionPaperModuleComponent', () => {
  let component: CreateQuestionPaperModuleComponent;
  let fixture: ComponentFixture<CreateQuestionPaperModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionPaperModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionPaperModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
