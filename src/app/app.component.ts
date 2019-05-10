import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { authConfig } from './auth.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store } from '@ngxs/store';
import { LoadUser } from './states/FocusState';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  title = 'app';
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    private oauthService: OAuthService, private router: Router,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private store: Store) {

    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(localStorage);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(function (success) {
      if (success) {
        router.navigate(['/focus']);
        store.dispatch(new LoadUser());
      }
    });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.mobileQuery.addListener(this.mobileQueryListener);
    if (this.oauthService.hasValidAccessToken()) {
      this.store.dispatch(new LoadUser());
    }
  }

  mobileQueryListener(ev: MediaQueryListEvent) {
    console.log(ev);
  }

  logout() {
    this.oauthService.logOut(true);
    this.router.navigate(["/home"]);
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }
}
