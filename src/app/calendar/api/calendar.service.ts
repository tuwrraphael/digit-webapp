import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CalendarConfiguration } from '../model/calendar-conifguration';
import { Feed } from '../model/feed';
import { CalendarLinkResponse } from '../model/calendar-link-response';

@Injectable()
export class CalendarService {

  constructor(private httpClient: HttpClient) { }

  getConfigurations() {
    return this.httpClient.get(`${environment.calendarServiceUrl}/api/configuration/list`).map(data => <CalendarConfiguration[]>data);
  }

  setFeeds(configId:string, subscribed: Feed[]) {
    return this.httpClient.put(`${environment.calendarServiceUrl}/api/configuration/${configId}/feeds`,
      subscribed.map(v => v.id)
    );
  }

  linkCalendar(calendarType:string) {
    return this.httpClient.post(`${environment.calendarServiceUrl}/api/configuration/link`, {
      calendarType: calendarType,
      redirectUri: window.location.origin + '/calendar/configure'
    }).map(data => <CalendarLinkResponse>data);
  }

  removeLink(configId: string) {
    return this.httpClient.delete(`${environment.calendarServiceUrl}/api/configuration`, {
      params: { id: configId }
    });
  }
}
