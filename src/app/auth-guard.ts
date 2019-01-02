import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private oauthService: OAuthService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    var hasAccessToken = this.oauthService.hasValidAccessToken();
    if (hasAccessToken) {
      return true;
    }
    else {
      this.router.navigate(["login"], { queryParamsHandling: "merge" });
      return false;
    }
  }
}
