import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

class Event {
  subject: string;
  location: string;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  events: Event[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(`${environment.calendarServiceUrl}/api/calendar/me`).subscribe(data => {
      this.events = <Event[]>data;
      this.events.forEach(v => {
        v.start = new Date(v.start);
        v.end = new Date(v.end);
      });
    });
  }

}
