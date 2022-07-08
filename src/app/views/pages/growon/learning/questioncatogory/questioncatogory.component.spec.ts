import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestioncatogoryComponent } from './questioncatogory.component';

describe('QuestioncatogoryComponent', () => {
  let component: QuestioncatogoryComponent;
  let fixture: ComponentFixture<QuestioncatogoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestioncatogoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestioncatogoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
