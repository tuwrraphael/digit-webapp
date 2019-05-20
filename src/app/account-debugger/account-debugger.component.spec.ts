import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDebuggerComponent } from './account-debugger.component';

describe('AccountDebuggerComponent', () => {
  let component: AccountDebuggerComponent;
  let fixture: ComponentFixture<AccountDebuggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDebuggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDebuggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
