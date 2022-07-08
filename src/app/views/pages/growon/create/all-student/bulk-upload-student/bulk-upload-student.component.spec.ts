import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadStudentComponent } from './bulk-upload-student.component';

describe('BulkUploadStudentComponent', () => {
  let component: BulkUploadStudentComponent;
  let fixture: ComponentFixture<BulkUploadStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
