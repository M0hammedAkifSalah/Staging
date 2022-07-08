import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportChapterMediaComponent } from './import-chapter-media.component';

describe('ImportChapterMediaComponent', () => {
  let component: ImportChapterMediaComponent;
  let fixture: ComponentFixture<ImportChapterMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportChapterMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportChapterMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
