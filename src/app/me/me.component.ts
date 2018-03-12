import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { CalendarService } from '../calendar/api/calendar.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  subscribedFeeds: number;
  calendarIncomplete: boolean = false;

  constructor(private oauthService: OAuthService,
    private calendarService: CalendarService) { }

  ngOnInit() {
    this.calendarService.getConfigurations().subscribe(v => {
      this.subscribedFeeds = v.map(x => x.feeds.filter(v => v.subscribed).length)
        .reduce((a, b) => a + b);
      this.calendarIncomplete = this.subscribedFeeds == 0;
    });
  }

  accessToken = null;

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
  }
}
