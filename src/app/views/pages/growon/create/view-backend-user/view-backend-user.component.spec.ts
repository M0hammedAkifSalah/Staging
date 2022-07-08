import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBackendUserComponent } from './view-backend-user.component';

describe('ViewBackendUserComponent', () => {
  let component: ViewBackendUserComponent;
  let fixture: ComponentFixture<ViewBackendUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBackendUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBackendUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
