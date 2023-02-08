import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNoFunctionComponent } from './dialog-no-function.component';

describe('DialogNoFunctionComponent', () => {
  let component: DialogNoFunctionComponent;
  let fixture: ComponentFixture<DialogNoFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNoFunctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNoFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
