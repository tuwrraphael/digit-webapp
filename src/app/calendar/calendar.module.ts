import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { ConfigureComponent } from './configure/configure.component';
import { ViewComponent } from './view/view.component';

import { FormsModule } from '@angular/forms';
import { CalendarService } from './api/calendar.service';

@NgModule({
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FormsModule
  ],
  declarations: [ConfigureComponent, ViewComponent],
  providers: [CalendarService]
})
export class CalendarModule { }
