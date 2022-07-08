import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromGlobalComponent } from './import-from-global.component';

describe('ImportFromGlobalComponent', () => {
  let component: ImportFromGlobalComponent;
  let fixture: ComponentFixture<ImportFromGlobalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFromGlobalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
