import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksBarComponent } from './bookmarks-bar.component';

describe('BookmarksComponent', () => {
  let component: BookmarksBarComponent;
  let fixture: ComponentFixture<BookmarksBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarksBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookmarksBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
