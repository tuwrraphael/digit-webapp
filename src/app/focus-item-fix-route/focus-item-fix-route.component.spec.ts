import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusItemFixRouteComponent } from './focus-item-fix-route.component';

describe('FocusItemFixRouteComponent', () => {
  let component: FocusItemFixRouteComponent;
  let fixture: ComponentFixture<FocusItemFixRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusItemFixRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusItemFixRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
