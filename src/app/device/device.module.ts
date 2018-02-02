import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { DeviceRoutingModule } from './device-routing.module';
import { LogComponent } from './log/log.component';


@NgModule({
  imports: [
    CommonModule,
    DeviceRoutingModule,
    HttpModule
  ],
  declarations: [LogComponent]
})
export class DeviceModule { }
