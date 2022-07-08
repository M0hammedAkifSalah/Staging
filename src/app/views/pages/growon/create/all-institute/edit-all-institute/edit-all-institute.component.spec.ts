import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAllInstituteComponent } from './edit-all-institute.component';

describe('EditAllInstituteComponent', () => {
  let component: EditAllInstituteComponent;
  let fixture: ComponentFixture<EditAllInstituteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAllInstituteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAllInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
