import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogComponent } from './log/log.component';
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class DeviceAuthGuard implements CanActivate {

  constructor(private oauthService: OAuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    var hasAccessToken = this.oauthService.hasValidAccessToken();
    return hasAccessToken;
  }
}

const routes: Routes = [{
  path: "device/:id", children: [{ path: "log", component: LogComponent }], canActivate: [DeviceAuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DeviceAuthGuard]
})
export class DeviceRoutingModule { }
