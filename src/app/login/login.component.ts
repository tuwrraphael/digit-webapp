import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private oauthService: OAuthService) {
  }

  ngOnInit() {
  }

  login() {
    this.oauthService.initImplicitFlow('/some-state;p1=1;p2=2');
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }
}
