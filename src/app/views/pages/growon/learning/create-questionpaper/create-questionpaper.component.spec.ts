import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionpaperComponent } from './create-questionpaper.component';

describe('CreateQuestionpaperComponent', () => {
  let component: CreateQuestionpaperComponent;
  let fixture: ComponentFixture<CreateQuestionpaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionpaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
