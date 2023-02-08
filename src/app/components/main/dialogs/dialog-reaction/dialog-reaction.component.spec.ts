import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReactionComponent } from './dialog-reaction.component';

describe('DialogReactionComponent', () => {
  let component: DialogReactionComponent;
  let fixture: ComponentFixture<DialogReactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogReactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogReactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
