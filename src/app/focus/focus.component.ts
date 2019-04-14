import { Component, OnInit, OnDestroy } from '@angular/core';
import { FocusDisplay, FocusItem } from '../model/FocusItem';
import { Store, Select } from '@ngxs/store';
import { LoadFocus, FocusState, PatchFocus, ConnectFocusHub, DisconnectFocusHub } from '../states/FocusState';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-focus',
  templateUrl: './focus.component.html',
  styleUrls: ['./focus.component.scss']
})
export class FocusComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.store.dispatch(new DisconnectFocusHub());
  }

  @Select(FocusState.focusItems) focusItems$: Observable<FocusDisplay[]>;
  @Select(FocusState.focusItemsLoading) focusItemsLoading$: Observable<boolean>;
  @Select(FocusState.focusItemsLoaded) focusItemsLoaded$: Observable<boolean>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new LoadFocus());
    this.store.dispatch(new ConnectFocusHub());
  }

  patchFocus() {
    this.store.dispatch(new PatchFocus(true));
  }
  showOffset(item: FocusDisplay) {
    return item.late && Math.abs(item.late) > 60000;
  }
  isLate(item: FocusDisplay) {
    return item.late && item.late > 60000;
  }
}