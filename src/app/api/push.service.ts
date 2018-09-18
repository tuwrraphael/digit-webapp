
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PushChannel } from '../model/push-channel';
import { PushChannelRegistration } from '../model/push-channel-registration';

@Injectable()
export class PushService {

  constructor(private httpClient: HttpClient) { }
  getConfigurations() {
    return this.httpClient.get(`${environment.pushServerUrl}/api/me/pushchannels`).pipe(map(data => <PushChannel[]>data));
  }
  deleteChannel(configId: string) {
    return this.httpClient.delete(`${environment.pushServerUrl}/api/pushchannels/${configId}`);
  }
  registerChannel(registration:PushChannelRegistration) {
    return this.httpClient.post(`${environment.pushServerUrl}api/me/pushchannels`, registration, {
      headers: new HttpHeaders().set("Content-Type", "application/vnd+pushserver.webpush+json")
    }).subscribe();
  }
}
