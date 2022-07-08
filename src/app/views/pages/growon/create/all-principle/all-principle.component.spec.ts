import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPrincipleComponent } from './all-principle.component';

describe('AllPrincipleComponent', () => {
  let component: AllPrincipleComponent;
  let fixture: ComponentFixture<AllPrincipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPrincipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPrincipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
