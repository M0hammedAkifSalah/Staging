import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportQuestionPaperComponent } from './import-question-paper.component';

describe('ImportQuestionPaperComponent', () => {
  let component: ImportQuestionPaperComponent;
  let fixture: ComponentFixture<ImportQuestionPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportQuestionPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportQuestionPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
