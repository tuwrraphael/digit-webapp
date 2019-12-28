import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeComponent } from './me/me.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AuthGuard } from './auth-guard';
import { LoginComponent } from './login/login.component';
import { FocusComponent } from './focus/focus.component';
import { PlannerComponent } from './planner/planner.component';
import { AccountDebuggerComponent } from './account-debugger/account-debugger.component';
import { FocusItemFixRouteComponent } from './focus-item-fix-route/focus-item-fix-route.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'focus',
    pathMatch: 'full'
  },
  {
    path: 'me',
    component: MeComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Einstellungen: Übersicht"
    }
  },
  {
    path: 'account-debugger',
    component: AccountDebuggerComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Account-Debugger"
    }
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Benachrichtigungseinstellungen"
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'focus',
    component: FocusComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Jetzt"
    },
  },
  {
    path: "focus/:id/fix-route",
    component: FocusItemFixRouteComponent
  },
  {
    path: 'planner',
    component: PlannerComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Planungsansicht"
    }
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
