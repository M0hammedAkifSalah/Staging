import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionpaperDeleteConfirmationComponent } from './questionpaper-delete-confirmation.component';

describe('QuestionpaperDeleteConfirmationComponent', () => {
  let component: QuestionpaperDeleteConfirmationComponent;
  let fixture: ComponentFixture<QuestionpaperDeleteConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionpaperDeleteConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionpaperDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
