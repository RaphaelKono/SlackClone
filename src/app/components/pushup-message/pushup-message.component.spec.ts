import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushupMessageComponent } from './pushup-message.component';

describe('PushupMessageComponent', () => {
  let component: PushupMessageComponent;
  let fixture: ComponentFixture<PushupMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushupMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushupMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
