import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public oauthService: OAuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request.url);
    if ((request.url.startsWith(environment.calendarServiceUrl) ||
      request.url.startsWith(environment.digitServiceUrl) ||
      request.url.startsWith(environment.pushServerUrl)) && this.oauthService.hasValidAccessToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.oauthService.getAccessToken()}`
        }
      });
    }
    return next.handle(request);
  }
}
