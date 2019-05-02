
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { TransitDirections, DirectionsResponse } from '../model/TransitDirections';
import { Observable } from 'rxjs';

export interface DirectionsRequest {
    startAddress?: string;
    startLat?: number;
    startLng?: number;
    endAddress?: string;
    arrivalTime?: Date;
    departureTime?: Date;
}

@Injectable()
export class TravelService {

    constructor(private httpClient: HttpClient) { }
    getDirections(request: DirectionsRequest): Observable<DirectionsResponse> {
        let params = new HttpParams();
        if (request.startLat && request.startLng) {
            params = params.set("startLat", request.startLat.toString());
            params = params.set("startLng", request.startLng.toString());
        }
        else if (request.startAddress) {
            params = params.set("startAddress", request.startAddress);
        }
        params = params.set("endAddress", request.endAddress);
        if (request.departureTime) {
            params = params.set("departureTime", request.departureTime.toISOString());
        } else if (request.arrivalTime) {
            params = params.set("arrivalTime", request.arrivalTime.toISOString());
        }
        return this.httpClient.get<TransitDirections>(`${environment.travelServiceUrl}/api/directions`, { params, observe: "response" })
            .pipe(map(res => { return { key: res.headers.get("ETag").replace(/"/g, ""), directions: this.mapData(res.body) }; }));
    }

    getDirectionsByKey(directionsKey: string) {
        return this.httpClient.get<TransitDirections>(`${environment.travelServiceUrl}/api/directions/${directionsKey}`).pipe(map(this.mapData));
    }

    private mapData(data: TransitDirections): TransitDirections {
        var dirs = <TransitDirections>data;
        if (dirs.routes && dirs.routes.length) {
            dirs.routes.forEach(r => {
                r.arrivalTime = new Date(r.arrivalTime);
                r.depatureTime = new Date(r.depatureTime);
                if (r.steps && r.steps.length) {
                    r.steps.forEach(s => {
                        s.arrivalTime = new Date(s.arrivalTime);
                        s.departureTime = new Date(s.departureTime);
                    });
                }
            });
        }
        return dirs;
    }
}
