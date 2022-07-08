import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningOutcomeComponent } from './learning-outcome.component';

describe('LearningOutcomeComponent', () => {
  let component: LearningOutcomeComponent;
  let fixture: ComponentFixture<LearningOutcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningOutcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
