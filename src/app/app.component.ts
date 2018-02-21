import { Component } from '@angular/core';

import { authConfig } from './auth.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(
    private oauthService: OAuthService) {

    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(localStorage);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.events.subscribe(e => {
      console.debug('oauth/oidc event', e);
    });
    this.oauthService.events.filter(e => e.type === 'session_terminated').subscribe(e => {
      console.debug('Your session has been terminated!');
    });
    this.oauthService.events.filter(e => e.type === 'token_received').subscribe(e => {
      console.debug('token received');
    });
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }
}
