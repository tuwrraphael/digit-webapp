
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FocusItem } from "../model/FocusItem";
import { map } from 'rxjs/operators';

@Injectable()
export class DigitService {

    constructor(private httpClient: HttpClient) { }
    getFocus() {
        return this.httpClient.get<FocusItem[]>(`${environment.digitServiceUrl}/api/me/focus`).pipe(map(data => {
            var items = <FocusItem[]>data;
            items.forEach(v => {
                v.indicateTime = new Date(v.indicateTime);
            });
            return items;
        }));
    }
    patchFocus() {
        return this.httpClient.patch<FocusItem[]>(`${environment.digitServiceUrl}/api/me/focus`, {}).pipe(map(data => {
            var items = <FocusItem[]>data;
            items.forEach(v => {
                v.indicateTime = new Date(v.indicateTime);
            });
            return items;
        }));
    }
}
