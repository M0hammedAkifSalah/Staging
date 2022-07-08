import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUniversitiesComponent } from './all-universities.component';

describe('AllUniversitiesComponent', () => {
  let component: AllUniversitiesComponent;
  let fixture: ComponentFixture<AllUniversitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllUniversitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUniversitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
