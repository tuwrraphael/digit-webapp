import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarService } from '../api/calendar.service';
import { EventData } from '../model/event';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  events: EventData[];

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.calendarService.getEvents().subscribe(data => {
      this.events = data;
    });
  }
}
