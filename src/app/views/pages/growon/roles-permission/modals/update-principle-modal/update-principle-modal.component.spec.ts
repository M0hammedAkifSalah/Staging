import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePrincipleModalComponent } from './update-principle-modal.component';

describe('UpdatePrincipleModalComponent', () => {
  let component: UpdatePrincipleModalComponent;
  let fixture: ComponentFixture<UpdatePrincipleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePrincipleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePrincipleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
