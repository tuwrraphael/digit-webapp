import { Component } from '@angular/core';

import { authConfig } from './auth.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(
    private oauthService: OAuthService, private router: Router) {

    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(localStorage);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(function(success) {
      console.log(success);
      if (success) {
        router.navigate(['/focus']);
      }
    });
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }
}
