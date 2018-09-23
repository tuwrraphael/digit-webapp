import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../api/calendar.service';
import { CalendarConfiguration } from '../model/calendar-conifguration';
import { Feed } from '../model/feed';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {

  constructor(private calendarService: CalendarService) { }

  configuration: CalendarConfiguration[];
  loading: boolean;

  reload() {
    this.configuration = null;
    this.loading = true;
    this.calendarService.getConfigurations().subscribe(data => {
      this.configuration = data;
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
        this.calendarService.setFeeds(c.id, c.feeds.filter(v => v.subscribed))
          .subscribe(() => {
            c.changed = false;
          });
      });
  }

  link(calendarType: string) {
    this.calendarService.linkCalendar(calendarType).subscribe(data => {
      location.replace(data.redirectUri);
    });
  }

  removeLink(configId: string) {
    this.calendarService.removeLink(configId).subscribe(data => {
      var config = this.configuration.find(v => v.id == configId);
      this.configuration.splice(this.configuration.indexOf(config), 1);
    });
  }
}
