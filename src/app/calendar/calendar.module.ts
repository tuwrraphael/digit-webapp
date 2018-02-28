import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { ConfigureComponent } from './configure/configure.component';
import { ViewComponent } from './view/view.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FormsModule
  ],
  declarations: [ConfigureComponent, ViewComponent]
})
export class CalendarModule { }
