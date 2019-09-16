import { Component, OnInit, Input } from '@angular/core';
import { FocusDisplay, DirectionsNotFoundReason } from '../model/FocusItem';

@Component({
  selector: 'app-focus-item',
  templateUrl: './focus-item.component.html',
  styleUrls: ['./focus-item.component.scss']
})
export class FocusItemComponent implements OnInit {

  constructor() { }

  @Input("focus-item") item: FocusDisplay;
  DirectionsNotFoundReason = DirectionsNotFoundReason;
  expanded = false;

  ngOnInit() {
  }

  hasRoute() {
    return this.item &&
      this.item.directions && this.item.directions.routes && this.item.directions.routes.length;
  }
}
