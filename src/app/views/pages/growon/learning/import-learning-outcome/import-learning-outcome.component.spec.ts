import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLearningOutcomeComponent } from './import-learning-outcome.component';

describe('ImportLearningOutcomeComponent', () => {
  let component: ImportLearningOutcomeComponent;
  let fixture: ComponentFixture<ImportLearningOutcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportLearningOutcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportLearningOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
