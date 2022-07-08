import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDeleteConfirmationComponent } from './section-delete-confirmation.component';

describe('SectionDeleteConfirmationComponent', () => {
  let component: SectionDeleteConfirmationComponent;
  let fixture: ComponentFixture<SectionDeleteConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionDeleteConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
