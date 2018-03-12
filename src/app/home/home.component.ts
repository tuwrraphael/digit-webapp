import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


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
