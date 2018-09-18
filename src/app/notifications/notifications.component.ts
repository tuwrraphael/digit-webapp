import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { SwPush } from '@angular/service-worker';

import { PushChannel } from '../model/push-channel';
import { PushChannelRegistration } from '../model/push-channel-registration';
import { PushService } from '../api/push.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  pushChannels: PushChannel[];

  constructor(private swPush: SwPush,
    private pushService: PushService) { }

  ngOnInit() {
    this.swPush.subscription.subscribe();
    this.pushService.getConfigurations()
      .subscribe(v => this.pushChannels = v);
  }
  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey
    })
      .then(sub => {
        var registration: PushChannelRegistration = {
          ...sub.toJSON(),
          browserInfo: navigator.userAgent,
          options: { "digit.notify": null }
        };
        this.pushService.registerChannel(registration);
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
