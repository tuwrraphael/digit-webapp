import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { DeviceModule } from './device/device.module';

import { MdcToolbarModule } from '@angular-mdc/web';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DeviceModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MdcToolbarModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
