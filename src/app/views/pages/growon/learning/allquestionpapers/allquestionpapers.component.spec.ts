import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllquestionpapersComponent } from './allquestionpapers.component';

describe('AllquestionpapersComponent', () => {
  let component: AllquestionpapersComponent;
  let fixture: ComponentFixture<AllquestionpapersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllquestionpapersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllquestionpapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
