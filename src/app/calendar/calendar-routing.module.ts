import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth-guard';
import { ConfigureComponent } from './configure/configure.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [{
  path: "calendar", children: [
    {
      path: "configure", component: ConfigureComponent,
      data: {
        title: "Kalendereinstellungen"
      }
    },
    {
      path: "view", component: ViewComponent,
      data: {
        title: "Kalender-Debugger"
      }
    }
  ], canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
