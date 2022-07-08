import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportChapterComponent } from './import-chapter.component';

describe('ImportChapterComponent', () => {
  let component: ImportChapterComponent;
  let fixture: ComponentFixture<ImportChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
