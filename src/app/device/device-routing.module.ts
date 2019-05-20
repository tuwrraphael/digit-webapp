import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogComponent } from './log/log.component';
import { AuthGuard } from '../auth-guard';


const routes: Routes = [{
  path: "device/:id", children: [{
    path: "log", component: LogComponent, data: {
      title: "Log"
    }
  }], canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceRoutingModule { }
