import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceBarComponent } from './workspace-bar.component';

describe('WorkspaceBarComponent', () => {
  let component: WorkspaceBarComponent;
  let fixture: ComponentFixture<WorkspaceBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspaceBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
