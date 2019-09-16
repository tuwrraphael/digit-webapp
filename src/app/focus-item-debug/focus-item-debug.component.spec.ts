import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusItemDebugComponent } from './focus-item-debug.component';

describe('FocusItemDebugComponent', () => {
  let component: FocusItemDebugComponent;
  let fixture: ComponentFixture<FocusItemDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusItemDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusItemDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
