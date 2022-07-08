import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendUserComponent } from './backend-user.component';

describe('BackendUserComponent', () => {
  let component: BackendUserComponent;
  let fixture: ComponentFixture<BackendUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
