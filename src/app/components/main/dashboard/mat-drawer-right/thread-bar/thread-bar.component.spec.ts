import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadBarComponent } from './thread-bar.component';

describe('ThreadBarComponent', () => {
  let component: ThreadBarComponent;
  let fixture: ComponentFixture<ThreadBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
