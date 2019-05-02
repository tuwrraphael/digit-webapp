import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, mergeMap } from 'rxjs/operators';
import { DigitService } from '../api/digit.service';
import { FocusItem, FocusDisplay } from '../model/FocusItem';
import { CalendarService } from '../calendar/api/calendar.service';
import { EventData } from '../calendar/model/event';
import unionBy from 'lodash-es/unionBy';
import { TravelService } from '../api/travel.service';
import { TransitDirections } from '../model/TransitDirections';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { environment } from '../../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { startOfToday, endOfToday, startOfTomorrow, endOfTomorrow, isAfter } from 'date-fns';
import { loadInternal } from '@angular/core/src/render3/util';

export class LoadFocus {
    static readonly type = "[Focus] Load";
    constructor() { }
}

export class ConnectFocusHub {
    static readonly type = "[Focus] Connect Hub";
    constructor() { }
}

export class DisconnectFocusHub {
    static readonly type = "[Focus] Disconnect Hub";
    constructor() { }
}

export class PatchFocus {
    static readonly type = "[Focus] Patch";
    constructor(public force: boolean) { }
}

export class LoadCalendarEvents {
    static readonly type = "[Calendar] Load Event";
    constructor(public eventIds: { eventId: string, feedId: string }[]) { }
}

export class LoadCalendarView {
    static readonly type = "[Calendar] Load View";
    constructor(public from: Date, public to: Date) { }
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
    patchedAt: Date;
    calendarItems: EventData[];
    directions: {
        [key: string]: TransitDirections
    };
    hubConnection: HubConnection;
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
        calendarEventsLoading: false,
        patchedAt: null,
        hubConnection: null
    }
})
export class FocusState {
    constructor(private digitService: DigitService, private calendarService: CalendarService,
        private travelService: TravelService, private oauthService: OAuthService) { }

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
            mergeMap((items) => ctx.dispatch(new LoadDirections(items.filter(v => null != v.directionsKey).map(v => v.directionsKey)))),
        );
    }

    @Action(ConnectFocusHub)
    connectFocusHub(ctx: StateContext<FocusStateModel>, action: ConnectFocusHub) {
        const state = ctx.getState();
        if (state.hubConnection) {
            state.hubConnection.stop();
        }
        let connection = new HubConnectionBuilder()
            .withUrl(`${environment.digitServiceUrl}/hubs/focus`, { accessTokenFactory: () => this.oauthService.getAccessToken() })
            .build();
        connection.on("focusChanged", items => {
            ctx.setState({
                ...ctx.getState(),
                focusItems: items
            });
            ctx.dispatch(new LoadCalendarEvents(items.map(v => { return { feedId: v.calendarEventFeedId, eventId: v.calendarEventId }; })));
            ctx.dispatch(new LoadDirections(items.filter(v => null != v.directionsKey).map(v => v.directionsKey)));
        });
        connection.start();
    }

    @Action(DisconnectFocusHub)
    disconnectFocusHub(ctx: StateContext<FocusStateModel>, action: DisconnectFocusHub) {
        const state = ctx.getState();
        if (state.hubConnection) {
            state.hubConnection.stop();
            ctx.setState({
                ...state,
                hubConnection: null
            });
        }
    }

    @Action(PatchFocus)
    patchFocus(ctx: StateContext<FocusStateModel>, action: PatchFocus) {
        const state = ctx.getState();
        if (!action.force && state.patchedAt && ((+new Date() - +state.patchedAt) < 1000 * 60)) {
            return false;
        }
        ctx.setState({
            ...state,
            focusItemsLoading: true
        });
        return this.digitService.patchFocus().pipe(tap((items) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                focusItems: items,
                focusItemsLoading: false,
                patchedAt: new Date()
            });
        }),
            tap((items) => ctx.dispatch(new LoadCalendarEvents(items.map(v => { return { feedId: v.calendarEventFeedId, eventId: v.calendarEventId }; })))),
            mergeMap((items) => ctx.dispatch(new LoadDirections(items.filter(v => null != v.directionsKey).map(v => v.directionsKey)))),
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

    @Action(LoadCalendarView)
    async loadCalendarView(ctx: StateContext<FocusStateModel>, action: LoadCalendarView) {
        let data = await this.calendarService.getEvents(action.from, action.to).toPromise();
        const state = ctx.getState();
        ctx.setState({
            ...state,
            calendarItems: unionBy(state.calendarItems, data, v => { return { feedId: v.feedId, id: v.id } }),
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
                directions[key] = await this.travelService.getDirectionsByKey(key).toPromise();
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
            await ctx.dispatch(new PatchFocus(false)).toPromise();
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
            let late = event && directions ? +directions.routes[0].arrivalTime - +event.start : null;
            return {
                id: item.id,
                indicateTime: item.indicateTime,
                isEvent: isEvent,
                isLoading: isEvent && null == event,
                event: event,
                directions: directions,
                directionsFound: !!item.directionsKey,
                late: late
            }
        }).sort(v => (+v.indicateTime) * -1);
    }
}