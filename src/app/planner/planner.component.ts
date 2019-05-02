import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { LoadCalendarView, FocusState } from '../states/FocusState';
import {startOfToday, endOfTomorrow} from "date-fns";
import { Observable } from 'rxjs';
import { EventData } from '../calendar/model/event';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {

  constructor(private store : Store) { }

  ngOnInit() {
    this.store.dispatch(new LoadCalendarView(startOfToday(), endOfTomorrow()));
  }

}
