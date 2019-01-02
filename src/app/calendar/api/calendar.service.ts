
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CalendarConfiguration } from '../model/calendar-conifguration';
import { Feed } from '../model/feed';
import { CalendarLinkResponse } from '../model/calendar-link-response';
import { EventData } from '../model/event';

@Injectable()
export class CalendarService {

  constructor(private httpClient: HttpClient) { }

  mapEvt(v: EventData): EventData {
    v.start = new Date(v.start);
    v.end = new Date(v.end);
    return v;
  }

  getEvents() {
    return this.httpClient.get(`${environment.calendarServiceUrl}/api/calendar/me`).pipe(map(data => {
      var events = <EventData[]>data;
      events.forEach(this.mapEvt);
      return events;
    }));
  }

  getEvent(feedId: string, eventId: string) {
    return this.httpClient.get(`${environment.calendarServiceUrl}/api/calendar/me/${encodeURIComponent(feedId)}/${encodeURIComponent(eventId)}`).pipe(map(data => {
      var evt = <EventData>data;
      return this.mapEvt(evt);
    }));
  }

  getConfigurations() {
    return this.httpClient.get(`${environment.calendarServiceUrl}/api/configuration/list`).pipe(map(data => <CalendarConfiguration[]>data));
  }

  setFeeds(configId: string, subscribed: Feed[]) {
    return this.httpClient.put(`${environment.calendarServiceUrl}/api/configuration/${configId}/feeds`,
      subscribed.map(v => v.id)
    );
  }

  linkCalendar(calendarType: string) {
    return this.httpClient.post(`${environment.calendarServiceUrl}/api/configuration/link`, {
      calendarType: calendarType,
      redirectUri: window.location.origin + '/calendar/configure'
    }).pipe(map(data => <CalendarLinkResponse>data));
  }

  removeLink(configId: string) {
    return this.httpClient.delete(`${environment.calendarServiceUrl}/api/configuration`, {
      params: { id: configId }
    });
  }
}
