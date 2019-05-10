
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map,  catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { CalendarService } from '../calendar/api/calendar.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface BatteryStatus {
  voltage: number;
  stateOfCharge: number;
  rawValue: number;
  lastMeasurementTime: Date;
  lastChargedTime: Date;
}

interface DeviceStatus {
  battery: BatteryStatus;
}

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  devices: DeviceStatus[];
  subscribedFeeds: number;

  constructor(private oauthService: OAuthService,
    private calendarService: CalendarService,
    private httpClient: HttpClient,
    private router: Router) { }

  ngOnInit() {
    this.calendarService.getConfigurations().subscribe(v => {
      if (null == v) {
        this.subscribedFeeds = 0;
      } else {
        this.subscribedFeeds = v.map(x => x.feeds.filter(v => v.subscribed).length)
          .reduce((a, b) => a + b);
      }
    });
    this.httpClient.get(`${environment.digitServiceUrl}/api/device`).pipe(
      map(data => <DeviceStatus[]>data))
      .subscribe(devices => {
        devices.forEach(v => {
          if (v.battery) {
            v.battery.lastMeasurementTime = v.battery.lastMeasurementTime ? new Date(v.battery.lastMeasurementTime) : null;
            v.battery.lastChargedTime = v.battery.lastChargedTime ? new Date(v.battery.lastChargedTime) : null;
          }
        });
        this.devices = devices;
      })
  }

  accessToken = null;

  get calendarIncomplete() {
    return false; //this.subscribedFeeds == 0 || (this.userInfo && !this.userInfo.calendarReminderActive);
  }

  get appIncomplete() {
    return false; //this.userInfo && !this.userInfo.pushChannelRegistered;
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  get userId() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims["sub"];
  }

  get scopes() {
    return this.oauthService.scope;
  }

  get expiration() {
    return new Date(this.oauthService.getAccessTokenExpiration());
  }

  showAccessToken() {
    this.accessToken = this.oauthService.getAccessToken();
  }

  timeSinceCharge(b: BatteryStatus) {
    if (!b.lastChargedTime) {
      return null;
    }
    return ((new Date().getTime()) - b.lastChargedTime.getTime()) / 1000 / 60 / 60;
  }

  logout() {
    this.oauthService.logOut(true);
    this.router.navigate(["/home"]);
  }

  measureBattery() {
    this.httpClient.post(`${environment.digitServiceUrl}/api/device/12345/battery/measure`, null)
      .subscribe();
  }
}
