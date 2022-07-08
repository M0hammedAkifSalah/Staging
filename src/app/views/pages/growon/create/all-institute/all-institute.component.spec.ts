import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInstituteComponent } from './all-institute.component';

describe('AllInstituteComponent', () => {
  let component: AllInstituteComponent;
  let fixture: ComponentFixture<AllInstituteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllInstituteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
