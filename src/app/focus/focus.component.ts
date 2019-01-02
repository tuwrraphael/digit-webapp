import { Component, OnInit } from '@angular/core';
import { FocusDisplay } from '../model/FocusItem';
import { Store, Select } from '@ngxs/store';
import { LoadFocus, FocusState } from '../states/FocusState';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-focus',
  templateUrl: './focus.component.html',
  styleUrls: ['./focus.component.scss']
})
export class FocusComponent implements OnInit {

  @Select(FocusState.focusItems) focusItems$: Observable<FocusDisplay[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new LoadFocus());
  }
}