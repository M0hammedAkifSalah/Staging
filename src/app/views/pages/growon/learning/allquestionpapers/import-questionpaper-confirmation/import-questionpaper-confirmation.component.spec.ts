import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportQuestionpaperConfirmationComponent } from './import-questionpaper-confirmation.component';

describe('ImportQuestionpaperConfirmationComponent', () => {
  let component: ImportQuestionpaperConfirmationComponent;
  let fixture: ComponentFixture<ImportQuestionpaperConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportQuestionpaperConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportQuestionpaperConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
