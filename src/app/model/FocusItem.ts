import { EventData } from "../calendar/model/event";
import { TransitDirections } from "./TransitDirections";

export interface FocusItem {
    end: Date;
    start: Date;
    calendarEventId: string;
    calendarEventFeedId: string;
    id: string;
    indicateTime: Date;
    directionsMetadata: DirectionsMetadata;
}
export interface DirectionsMetadata {
    key: string;
    error?: DirectionsNotFoundReason;
    peferredRoute : number;
}

export enum DirectionsNotFoundReason {
    AddressNotFound = 0,
    RouteNotFound = 1
}
export interface FocusDisplay {
    event: EventData;
    isEvent: boolean;
    isLoading: boolean;
    id: string;
    indicateTime: Date;
    directions: TransitDirections;
    directionsMetadata : DirectionsMetadata,
    late: number;
    backgroundColor: string;
    foregroundColor : string;
}

export interface Plan {
    getUp : Date;
    focusItems: FocusItem[];
}