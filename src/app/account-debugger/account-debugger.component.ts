import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-account-debugger',
  templateUrl: './account-debugger.component.html',
  styleUrls: ['./account-debugger.component.scss']
})
export class AccountDebuggerComponent implements OnInit {
  accessToken: string;

  constructor(private oauthService: OAuthService) { }

  ngOnInit() {
  }

  get scopes() {
    return this.oauthService.scope;
  }

  get expiration() {
    return new Date(this.oauthService.getAccessTokenExpiration());
  }
  
  get userId() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims["sub"];
  }

  showAccessToken() {
    this.accessToken = this.oauthService.getAccessToken();
  }

}
