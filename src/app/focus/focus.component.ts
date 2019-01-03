import { Component, OnInit, OnDestroy } from '@angular/core';
import { FocusDisplay } from '../model/FocusItem';
import { Store, Select } from '@ngxs/store';
import { LoadFocus, FocusState, PatchFocus } from '../states/FocusState';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-focus',
  templateUrl: './focus.component.html',
  styleUrls: ['./focus.component.scss']
})
export class FocusComponent implements OnInit {

  @Select(FocusState.focusItems) focusItems$: Observable<FocusDisplay[]>;
  @Select(FocusState.focusItemsLoading) focusItemsLoading$: Observable<boolean>;
  @Select(FocusState.focusItemsLoaded) focusItemsLoaded$: Observable<boolean>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new LoadFocus());
  }

  patchFocus() {
    this.store.dispatch(new PatchFocus());
  }
}