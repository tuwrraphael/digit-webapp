import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { SwPush } from '@angular/service-worker';

import { PushChannel } from '../model/push-channel';
import { PushChannelRegistration } from '../model/push-channel-registration';
import { PushService } from '../api/push.service';
const STORAGE_KEY = "pushconfigid";
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  pushChannels: PushChannel[];

  localPushConfigId: string;

  constructor(private swPush: SwPush,
    private pushService: PushService) {
    this.localPushConfigId = localStorage.getItem(STORAGE_KEY);
  }

  ngOnInit() {
    var swPushSubscription = this.swPush.subscription.subscribe(v => {
      if (null == v && null != this.localPushConfigId) {
        this.unsubscribe(this.localPushConfigId);
      }
      swPushSubscription.unsubscribe();
    });
    this.pushService.getConfigurations()
      .subscribe(v => this.pushChannels = v);
  }

  isSubscribed() {
    return !!this.localPushConfigId;
  }

  deleteSubscription(id: string) {
    this.pushService.deleteChannel(id)
      .subscribe(() => {
        if (this.localPushConfigId == id) {
          this.localPushConfigId = null;
          localStorage.removeItem(STORAGE_KEY);
        }
        this.pushChannels = this.pushChannels.filter(v => v.id != id);
      });
  }

  unsubscribe(id: string) {
    if (this.localPushConfigId == id) {
      this.swPush.unsubscribe().then(() => this.deleteSubscription(id));
    } else {
      this.deleteSubscription(id);
    }
  }

  subscribe() {
    this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey
    })
      .then(sub => {
        var registration: PushChannelRegistration = {
          ...sub.toJSON(),
          browserInfo: navigator.userAgent,
          options: { "digit.notify": null }
        };
        this.pushService.registerChannel(registration).subscribe(
          v => {
            this.localPushConfigId = v.id;
            localStorage.setItem(STORAGE_KEY, v.id);
            this.pushChannels.push(v);
          });
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
