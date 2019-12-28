import { Component, OnInit, OnDestroy } from '@angular/core';
import { FocusState, LoadFocusItem } from '../states/FocusState';
import { Observable, Subscription } from 'rxjs';
import { FocusDisplay } from '../model/FocusItem';
import { Store, Select } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { ImportPOI, FindNearestStops, NavigationState } from '../states/NavigationState';

@Component({
  selector: 'app-focus-item-fix-route',
  templateUrl: './focus-item-fix-route.component.html',
  styleUrls: ['./focus-item-fix-route.component.scss']
})
export class FocusItemFixRouteComponent implements OnInit, OnDestroy {
  sub: Subscription;

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  focusItem: FocusDisplay;

  @Select(NavigationState) focusItems$: Observable<FocusDisplay[]>;

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get("id");
      this.sub = this.store.select(FocusState.focusItem(id))
        .subscribe(s => this.focusItem = s);
      this.store.dispatch(new LoadFocusItem(id));
    });
    this.store.dispatch(new ImportPOI());
    this.store.dispatch(new FindNearestStops());
  }

}

