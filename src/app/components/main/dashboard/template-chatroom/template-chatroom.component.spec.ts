import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateChatroomComponent } from './template-chatroom.component';

describe('TemplateChatroomComponent', () => {
  let component: TemplateChatroomComponent;
  let fixture: ComponentFixture<TemplateChatroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateChatroomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
