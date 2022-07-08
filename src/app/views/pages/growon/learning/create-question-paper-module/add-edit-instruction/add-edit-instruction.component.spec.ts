import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInstructionComponent } from './add-edit-instruction.component';

describe('AddEditInstructionComponent', () => {
  let component: AddEditInstructionComponent;
  let fixture: ComponentFixture<AddEditInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
