
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FocusItem, Plan } from "../model/FocusItem";
import { map } from 'rxjs/operators';

@Injectable()
export class DigitService {

    constructor(private httpClient: HttpClient) { }
    getFocus() {
        return this.httpClient.get<FocusItem[]>(`${environment.digitServiceUrl}/api/me/focus`).pipe(map(data => {
            var items = <FocusItem[]>data;
            items.forEach(v => {
                v.indicateTime = new Date(v.indicateTime);
                v.start = new Date(v.start);
                v.end = new Date(v.end);
            });
            return items;
        }));
    }
    patchFocus() {
        return this.httpClient.patch<FocusItem[]>(`${environment.digitServiceUrl}/api/me/focus`, {}).pipe(map(data => {
            var items = <FocusItem[]>data;
            items.forEach(v => {
                v.indicateTime = new Date(v.indicateTime);
                v.start = new Date(v.start);
                v.end = new Date(v.end);
            });
            return items;
        }));
    }
    getPlan(from:Date,to:Date) {
        let params = new HttpParams();
        params = params.set("from", from.toISOString());
        params = params.set("to", to.toISOString());
        return this.httpClient.get<Plan>(`${environment.digitServiceUrl}/api/me/plan`, {params}).pipe(map(data => {
            data.focusItems.forEach(v => {
                v.indicateTime = new Date(v.indicateTime);
                v.start = new Date(v.start);
                v.end = new Date(v.end);
            });
            return data;
        }));
    }
}
