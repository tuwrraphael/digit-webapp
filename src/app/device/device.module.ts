import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DeviceRoutingModule } from './device-routing.module';
import { LogComponent } from './log/log.component';


@NgModule({
  imports: [
    CommonModule,
    DeviceRoutingModule,
    HttpClientModule
  ],
  declarations: [LogComponent]
})
export class DeviceModule { }
