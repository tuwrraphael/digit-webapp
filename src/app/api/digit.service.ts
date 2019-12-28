
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FocusItem } from "../model/FocusItem";
import { map } from 'rxjs/operators';

@Injectable()
export class DigitService {

    constructor(private httpClient: HttpClient) { }
    private convert(v: FocusItem) {
        v.indicateTime = new Date(v.indicateTime);
        v.start = new Date(v.start);
        v.end = new Date(v.end);
        return v;
    }
    getFocusItem(id: string) {
        return this.httpClient.get<FocusItem>(`${environment.digitServiceUrl}/api/me/focus/${id}`).pipe(map(data => {
            this.convert(data);
            return data;
        }));
    }
    getFocus() {
        return this.httpClient.get<FocusItem[]>(`${environment.digitServiceUrl}/api/me/focus`).pipe(map(data => {
            data.forEach(this.convert);
            return data;
        }));
    }
    patchFocus() {
        return this.httpClient.patch<FocusItem[]>(`${environment.digitServiceUrl}/api/me/focus`, {}).pipe(map(data => {
            data.forEach(this.convert);
            return data;
        }));
    }
}
