import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { DeviceModule } from './device/device.module';
import { CalendarModule } from './calendar/calendar.module';

import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './auth-guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth.token-interceptor';
import { MeComponent } from './me/me.component';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { PushService } from './api/push.service';
import { FocusComponent } from './focus/focus.component';
import { LoginComponent } from './login/login.component';
import { DigitService } from './api/digit.service';
import { NgxsModule } from '@ngxs/store';
import { FocusState } from './states/FocusState';
import { TravelService } from './api/travel.service';
import { PlannerComponent } from './planner/planner.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule, MatSnackBarModule} from '@angular/material';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { AccountDebuggerComponent } from './account-debugger/account-debugger.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MeComponent,
    NotificationsComponent,
    FocusComponent,
    PlannerComponent,
    AccountDebuggerComponent
  ],
  imports: [
    DeviceModule,
    CalendarModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatSnackBarModule,
    OAuthModule.forRoot(),
    CommonModule,
    NgxsModule.forRoot([
      FocusState
    ]),
    NgxsRouterPluginModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' },
    AuthGuard,
    PushService,
    DigitService,
    TravelService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
