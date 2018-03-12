import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public oauthService: OAuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request.url);
    if (request.url.startsWith(environment.calendarServiceUrl) && this.oauthService.hasValidAccessToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.oauthService.getAccessToken()}`
        }
      });
    }
    return next.handle(request);
  }
}