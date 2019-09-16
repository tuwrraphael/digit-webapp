import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusItemLocationComponent } from './focus-item-location.component';

describe('FocusItemLocationComponent', () => {
  let component: FocusItemLocationComponent;
  let fixture: ComponentFixture<FocusItemLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusItemLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusItemLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
