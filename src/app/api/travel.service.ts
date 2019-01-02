
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { TransitDirections } from '../model/TransitDirections';

@Injectable()
export class TravelService {

    constructor(private httpClient: HttpClient) { }
    getDirections(directionsKey: string) {
        return this.httpClient.get<TransitDirections>(`${environment.travelServiceUrl}/api/directions/${directionsKey}`).pipe(map(data => {
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

                return dirs;
            }
        }));
    }
}
