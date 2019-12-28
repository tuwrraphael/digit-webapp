import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { authConfig } from './auth.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { Router, NavigationEnd, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store, Select } from '@ngxs/store';
import { LoadUser } from './states/FocusState';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  sub: Subscription;
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.sub.unsubscribe();
  }
  title = 'app';
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  router$: Observable<any>;
  pageTitle: string;

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
    this.router$ = this.store.select(state => state.router);
    this.sub = this.router$.subscribe(s => {
      if (s.state && s.state.root) {
        var route = s.state.root;
        while (route.firstChild) route = route.firstChild;
        this.pageTitle = route.data.title
      }
    });
  }

  mobileQueryListener(ev: MediaQueryListEvent) {
    
  }

  logout() {
    this.oauthService.logOut(true);
    this.router.navigate(["/home"]);
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }
}
