import { EventData } from "../calendar/model/event";
import { TransitDirections } from "./TransitDirections";

export interface FocusItem {
    calendarEventId: string;
    calendarEventFeedId: string;
    id: string;
    indicateTime: Date;
    directionsKey: string;
}

export interface FocusDisplay {
    event: EventData;
    isEvent: boolean;
    isLoading: boolean;
    id: string;
    indicateTime: Date;
    directions: TransitDirections;
    directionsFound: boolean;
    late: number;
}
