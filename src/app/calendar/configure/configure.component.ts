import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

class CalendarLinkResponse {
  redirectUri: string;
}

class Feed {
  id: string;
  name: string;
  subscribed: boolean;
}

class CalendarConfiguration {
  changed: boolean;
  id: string;
  feeds: Feed[];
}

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {

  constructor(private http: HttpClient) { }

  private configuration: CalendarConfiguration[];
  private loading: boolean;

  reload() {
    this.configuration = null;
    this.loading = true;
    this.http.get(`${environment.calendarServiceUrl}/api/configuration/list`).subscribe(data => {
      this.configuration = <CalendarConfiguration[]>data;
      this.loading = false;
    });
  }

  ngOnInit() {
    this.reload();
  }

  subscribedFeeds(feeds: Feed[]) {
    return feeds.filter(v => v.subscribed).map(v => v.name).join(', ');
  }

  changeFeed(configId: string, feedId: string, active: boolean) {
    var config = this.configuration.find(v => v.id == configId);
    config.changed = true;
    config.feeds.find(v => v.id == feedId)
      .subscribed = active;
  }

  configChanged() {
    return this.configuration.some(a => a.changed);
  }

  saveConfig() {
    this.configuration.filter(a => a.changed)
      .forEach(c => {
        this.http.put(`${environment.calendarServiceUrl}/api/configuration/${c.id}/feeds`,
          c.feeds.filter(v => v.subscribed).map(v => v.id)
        ).subscribe(() => {
          c.changed = false;
        });
      });
  }

  link(calendarType: string) {
    this.http.post(`${environment.calendarServiceUrl}/api/configuration/link`, {
      calendarType: calendarType,
      redirectUri: window.location.origin + '/calendar/configure'
    }).subscribe(data => {
      var res = <CalendarLinkResponse>data;
      location.replace(res.redirectUri);
    });
  }

  removeLink(configId: string) {
    this.http.delete(`${environment.calendarServiceUrl}/api/configuration`, {
      params: { id: configId }
    }).subscribe(data => {
      var config = this.configuration.find(v => v.id == configId);
      this.configuration.splice(this.configuration.indexOf(config));
    });
  }

}
