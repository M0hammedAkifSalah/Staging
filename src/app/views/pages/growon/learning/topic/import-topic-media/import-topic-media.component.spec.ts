import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTopicMediaComponent } from './import-topic-media.component';

describe('ImportTopicMediaComponent', () => {
  let component: ImportTopicMediaComponent;
  let fixture: ComponentFixture<ImportTopicMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTopicMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTopicMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
