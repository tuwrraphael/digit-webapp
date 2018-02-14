import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

import { LogEntry } from './log-entry';

import { HubConnection } from '@aspnet/signalr-client';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute, private http: Http) { }

  deviceId: string;
  log: LogEntry[];
  connection: HubConnection;

  ngOnInit() {
    this.activatedRoute.parent.params.map(p => p.id).subscribe(id => {
      this.deviceId = id;
      this.http.get(`${environment.digitServiceUrl}/api/device/${id}/log`, { params: { history: 15 } }).subscribe(data => {
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
      this.connection = new HubConnection(`${environment.digitServiceUrl}/log`);
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
    this.http.post(`${environment.digitServiceUrl}/api/device/${this.deviceId}/log`, {
      occurenceTime: new Date(),
      code: 99,
      message: "test"
    }).subscribe();
  }

  iconDictionary = { "0": "info", "99": "code", "3": "error", "4": "error", "1" : "done" };

  getIcon(level: number) {
    return this.iconDictionary[level];
  }
}
