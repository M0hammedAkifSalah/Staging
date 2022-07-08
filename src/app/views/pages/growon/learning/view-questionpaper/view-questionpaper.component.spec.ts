import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuestionpaperComponent } from './view-questionpaper.component';

describe('ViewQuestionpaperComponent', () => {
  let component: ViewQuestionpaperComponent;
  let fixture: ComponentFixture<ViewQuestionpaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQuestionpaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuestionpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
