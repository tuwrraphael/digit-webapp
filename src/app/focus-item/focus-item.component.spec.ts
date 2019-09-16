import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusItemComponent } from './focus-item.component';

describe('FocusItemComponent', () => {
  let component: FocusItemComponent;
  let fixture: ComponentFixture<FocusItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
