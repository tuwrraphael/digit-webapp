import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, mergeMap } from 'rxjs/operators';
import { DigitService } from '../api/digit.service';
import { FocusItem, FocusDisplay } from '../model/FocusItem';
import { CalendarService } from '../calendar/api/calendar.service';
import { EventData } from '../calendar/model/event';
import unionBy from 'lodash-es/unionBy';
import { TravelService } from '../api/travel.service';
import { TransitDirections } from '../model/TransitDirections';

export class LoadFocus {
    static readonly type = "[Focus] Load";
    constructor() { }
}

export class PatchFocus {
    static readonly type = "[Focus] Patch";
    constructor() { }
}

export class LoadCalendarEvents {
    static readonly type = "[Calendar] Load Event";
    constructor(public eventIds: { eventId: string, feedId: string }[]) { }
}

export class LoadDirections {
    static readonly type = "[Directions] Load";
    constructor(public directionKeys: string[]) { }
}

export interface FocusStateModel {
    focusItems: FocusItem[];
    focusItemsLoaded: boolean;
    focusItemsLoading: boolean;
    directionsLoading: boolean;
    calendarEventsLoading: boolean;
    calendarItems: EventData[];
    directions: {
        [key: string]: TransitDirections
    };
}

@State<FocusStateModel>({
    name: "focusState",
    defaults: {
        focusItems: [],
        calendarItems: [],
        directions: {},
        focusItemsLoaded: false,
        focusItemsLoading: false,
        directionsLoading: false,
        calendarEventsLoading: false
    }
})
export class FocusState {
    constructor(private digitService: DigitService, private calendarService: CalendarService,
        private travelService: TravelService) { }

    @Action(LoadFocus)
    loadFocus(ctx: StateContext<FocusStateModel>, action: LoadFocus) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            focusItemsLoading: true
        });
        return this.digitService.getFocus().pipe(tap((items) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                focusItems: items,
                focusItemsLoading: false,
                focusItemsLoaded: true
            });
        }),
            tap((items) => ctx.dispatch(new LoadCalendarEvents(items.map(v => { return { feedId: v.calendarEventFeedId, eventId: v.calendarEventId }; })))),
            mergeMap((items) => ctx.dispatch(new LoadDirections(items.map(v => v.directionsKey)))),
        );
    }

    @Action(PatchFocus)
    patchFocus(ctx: StateContext<FocusStateModel>, action: PatchFocus) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            focusItemsLoading: true
        });
        return this.digitService.patchFocus().pipe(tap((items) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                focusItems: items,
                focusItemsLoading: false
            });
        }),
            tap((items) => ctx.dispatch(new LoadCalendarEvents(items.map(v => { return { feedId: v.calendarEventFeedId, eventId: v.calendarEventId }; })))),
            mergeMap((items) => ctx.dispatch(new LoadDirections(items.map(v => v.directionsKey)))),
        );
    }

    @Action(LoadCalendarEvents)
    async loadCalendarEvents(ctx: StateContext<FocusStateModel>, action: LoadCalendarEvents) {
        ctx.setState({
            ...ctx.getState(),
            calendarEventsLoading: true
        });
        var evtData: EventData[] = [];
        for (var evt of action.eventIds) {
            try {
                evtData.push(await this.calendarService.getEvent(evt.feedId, evt.eventId).toPromise());
            }
            catch {

            }
        }
        const state = ctx.getState();
        ctx.setState({
            ...state,
            calendarItems: unionBy(evtData, state.calendarItems, v => { return { feedId: v.feedId, id: v.id } }),
            calendarEventsLoading: false
        });
    }

    @Action(LoadDirections)
    async loadDirections(ctx: StateContext<FocusStateModel>, action: LoadDirections) {
        ctx.setState({
            ...ctx.getState(),
            directionsLoading: true
        });
        var directionErrors = false;
        var directions: {
            [key: string]: TransitDirections
        } = {};
        for (var key of action.directionKeys) {
            try {
                directions[key] = await this.travelService.getDirections(key).toPromise();
            }
            catch{
                directionErrors = true;
            }
        }
        const state = ctx.getState();
        console.log(directions);
        ctx.setState({
            ...state,
            directions: {
                ...state.directions,
                ...directions
            },
            directionsLoading: false
        });
        if (directionErrors) {
            await ctx.dispatch(new PatchFocus()).toPromise();
        }
    }

    @Selector()
    static focusItemsLoading(state: FocusStateModel): boolean {
        return state.focusItemsLoading || state.directionsLoading || state.calendarEventsLoading;
    }

    @Selector()
    static focusItemsLoaded(state: FocusStateModel): boolean {
        return state.focusItemsLoaded;
    }

    @Selector()
    static focusItems(state: FocusStateModel): FocusDisplay[] {
        return state.focusItems.map(item => {
            var isEvent = !!(item.calendarEventId && item.calendarEventFeedId);
            var event = isEvent ? state.calendarItems.find(v => v.id == item.calendarEventId && v.feedId == item.calendarEventFeedId) : null;
            var directions = item.directionsKey ? state.directions[item.directionsKey] : null;
            return {
                id: item.id,
                indicateTime: item.indicateTime,
                isEvent: isEvent,
                isLoading: isEvent && null == event,
                event: event,
                directions: directions
            }
        }).sort(v => (+v.indicateTime) * -1);
    }
}