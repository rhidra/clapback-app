import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactCommentListComponent } from './comment-list.component';

describe('CommentListComponent', () => {
  let component: ReactCommentListComponent;
  let fixture: ComponentFixture<ReactCommentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactCommentListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactCommentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
