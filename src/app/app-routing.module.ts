import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeComponent } from './me/me.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AuthGuard } from './auth-guard';
import { LoginComponent } from './login/login.component';
import { FocusComponent } from './focus/focus.component';
import { PlannerComponent } from './planner/planner.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'focus',
    pathMatch: 'full'
  },
  {
    path: 'me',
    component: MeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'focus',
    component: FocusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'planner',
    component: PlannerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: 'login'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
