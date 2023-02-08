import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenboxComponent } from './openbox.component';

describe('OpenboxComponent', () => {
  let component: OpenboxComponent;
  let fixture: ComponentFixture<OpenboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
