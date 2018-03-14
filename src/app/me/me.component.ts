import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { CalendarService } from '../calendar/api/calendar.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

interface UserInformation {
  pushChannelRegistered: string;
  calendarReminderActive: string;
}

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  userCreation: string;
  maintainance: string = null;
  userInfo: UserInformation;
  subscribedFeeds: number;

  constructor(private oauthService: OAuthService,
    private calendarService: CalendarService,
    private httpClient: HttpClient,
    private router : Router) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 404) {
      this.userCreation = "running";
      this.httpClient.post(`${environment.digitServiceUrl}/api/user`, null)
        .map(data => <UserInformation>data)
        .subscribe(info => {
          this.userCreation = "done";
          this.userInfo = info;
        }, () => this.userCreation = "error");
    }
    return new ErrorObservable("Get user failed");
  };

  ngOnInit() {
    this.calendarService.getConfigurations().subscribe(v => {
      if (null == v) {
        this.subscribedFeeds = 0;
      } else {
        this.subscribedFeeds = v.map(x => x.feeds.filter(v => v.subscribed).length)
          .reduce((a, b) => a + b);
      }
    });
    this.httpClient.get(`${environment.digitServiceUrl}/api/user`)
      .pipe(catchError(this.handleError))
      .map(data => <UserInformation>data)
      .subscribe(userInfo => {
        this.userInfo = userInfo;
        if (!userInfo.calendarReminderActive) {
          this.maintainance = "running";
          this.httpClient.patch(`${environment.digitServiceUrl}/api/user`, null)
            .map(data => <UserInformation>data)
            .subscribe(info => {
              this.maintainance = "done";
              this.userInfo = info;
            }, () => this.maintainance = "error");
        }
      });
  }

  accessToken = null;

  get calendarIncomplete() {
    return this.subscribedFeeds == 0 || (this.userInfo && !this.userInfo.calendarReminderActive);
  }

  get appIncomplete() {
    return this.userInfo && !this.userInfo.pushChannelRegistered;
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

  logout() {
    this.oauthService.logOut(true);
    this.router.navigate(["/home"]);
  }
}
