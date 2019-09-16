import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FocusState, LoadPlan } from '../states/FocusState';
import {startOfToday, endOfTomorrow} from "date-fns";
import { Observable } from 'rxjs';
import { FocusDisplay } from '../model/FocusItem';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {

  constructor(private store : Store) { }

  ngOnInit() {
    this.store.dispatch(new LoadPlan(startOfToday(), endOfTomorrow()));
  }

  @Select(FocusState.planerItems) plannerItems$: Observable<FocusDisplay[]>;

}
