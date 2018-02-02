import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LogEntry } from './log-entry';

import { HubConnection } from '@aspnet/signalr-client';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute, private http: Http) { }

  deviceId: string;
  log: LogEntry[];
  connection: HubConnection;

  ngOnInit() {
    this.activatedRoute.parent.params.map(p => p.id).subscribe(id => {
      this.deviceId = id;
      this.http.get(`https://digit-app.azurewebsites.net/api/device/${id}/log`, { params: { history: 15 } }).subscribe(data => {
        this.log = data.json() || [];
        this.log.reverse();
        this.log.forEach(entry => {
          entry.occurenceTime = new Date(entry.occurenceTime);
          entry.logTime = new Date(entry.logTime);
        });
      });
      if (this.connection) {
        this.connection.stop();
      }
      this.connection = new HubConnection("https://digit-app.azurewebsites.net/log");
      this.connection.on("log", data => {
        this.log.unshift(data);
      });
      this.connection.start();
    });
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.stop();
    }
  }

  testLogEntry() {
    this.http.post(`https://digit-app.azurewebsites.net/api/device/${this.deviceId}/log`, {
      occurenceTime: new Date(),
      code: 99,
      message: "test"
    }).subscribe();
  }
}
