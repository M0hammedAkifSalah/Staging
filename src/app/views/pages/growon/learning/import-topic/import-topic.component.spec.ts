import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTopicComponent } from './import-topic.component';

describe('ImportTopicComponent', () => {
  let component: ImportTopicComponent;
  let fixture: ComponentFixture<ImportTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
