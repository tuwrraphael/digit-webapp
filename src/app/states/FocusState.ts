import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, mergeMap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
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
import { addHours } from 'date-fns';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {MatSnackBar, MatSortModule} from '@angular/material';

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

export class LoadPlan {
    static readonly type = "[Focus] Load Plan";
    constructor(public from: Date, public to: Date) { }
}

export class LoadUser {
    static readonly type = "[App] Load User";
    constructor() { }
}

export class CreateUser {
    static readonly type = "[App] Create User";
    constructor() { }
}

export class PatchUser {
    static readonly type = "[App] Patch User";
    constructor() { }
}

interface UserInformation {
    pushChannelRegistered: string;
    calendarReminderActive: string;
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
    userInformation: UserInformation;
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
        hubConnection: null,
        userInformation: null
    }
})
export class FocusState {
    constructor(private digitService: DigitService, private calendarService: CalendarService,
        private travelService: TravelService, private oauthService: OAuthService,
        private httpClient: HttpClient,
        private matSnackBar: MatSnackBar) { }

    @Action(LoadFocus)
    loadFocus(ctx: StateContext<FocusStateModel>, action: LoadFocus) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            focusItemsLoading: true
        });
        let now = new Date();
        return this.digitService.getFocus().pipe(tap((items) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                focusItems: unionBy(state.focusItems.filter(i => !(i.start < addHours(now, 2) && now < i.end)), items, i => i.id),
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
        connection.on("focusChanged", (items : FocusItem[]) => {
            items.forEach(element => {
                element.indicateTime = new Date(element.indicateTime);
                element.start = new Date(element.start);
                element.end = new Date(element.end);
            });
            let now = new Date();
            ctx.setState({
                ...ctx.getState(),
                focusItems: unionBy(state.focusItems.filter(i => !(i.start < addHours(now, 2) && now < i.end)), items, i => i.id)
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
            let now = new Date();
            ctx.setState({
                ...state,
                focusItems: unionBy(state.focusItems.filter(i => !(i.start < addHours(now, 2) && now < i.end)), items, i => i.id),
                focusItemsLoading: false,
                patchedAt: new Date()
            });
        }),
            tap((items) => ctx.dispatch(new LoadCalendarEvents(items.map(v => { return { feedId: v.calendarEventFeedId, eventId: v.calendarEventId }; })))),
            mergeMap((items) => ctx.dispatch(new LoadDirections(items.filter(v => null != v.directionsKey).map(v => v.directionsKey)))),
        );
    }

    @Action(CreateUser)
    createUser(ctx: StateContext<FocusStateModel>, action: CreateUser) {
        this.matSnackBar.open("Account wird zum ersten Mal konfiguriert.");
        return this.httpClient.post<UserInformation>(`${environment.digitServiceUrl}/api/user`, null).pipe(
            catchError((e) => {
                this.matSnackBar.open("Account konnte nicht konfiguriert werden.");
                return throwError("Create user failed");
            }),
            tap(info => {
                this.matSnackBar.open("Account wurde angelegt.");
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    userInformation: info
                });
            }));
    }

    @Action(PatchUser)
    patchUser(ctx: StateContext<FocusStateModel>, action: PatchUser) {
        this.matSnackBar.open("Es wird eine automatische Wartung ausgeführt.");
        return this.httpClient.patch<UserInformation>(`${environment.digitServiceUrl}/api/user`, null).pipe(
            catchError((e) => {
                this.matSnackBar.open("Beim Ausführen einer automatischen Wartung kam es zu einem Fehler.");
                return throwError("Create user failed");
            }),
            tap(info => {
                this.matSnackBar.open("Es wurde eine automatische Wartung ausgeführt.");
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    userInformation: info
                });
            }));
    }

    @Action(LoadUser)
    loadUser(ctx: StateContext<FocusStateModel>, action: LoadUser) {
        return this.httpClient.get<UserInformation>(`${environment.digitServiceUrl}/api/user`)
            .pipe(catchError((error) => {
                if (error.status == 404) {
                    ctx.dispatch(new CreateUser());
                }
                return throwError("Get user failed");
            }), tap((info: UserInformation) => {
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    userInformation: info
                });
                if (!info.calendarReminderActive) {
                    return ctx.dispatch(new PatchUser());
                }
            }));
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

    // @Action(LoadPlan)
    // loadPlan(ctx: StateContext<FocusStateModel>, action: LoadPlan) {
    //     const state = ctx.getState();
    //     ctx.setState({
    //         ...state,
    //         planLoading: true
    //     });
    //     let now = new Date();
    //     return this.digitService.getPlan(action.from, action.to).pipe(tap((items) => {
    //         const state = ctx.getState();
    //         ctx.setState({
    //             ...state,
    //             focusItems: unionBy(state.focusItems.filter(i => !(i.start < action.to && action.from < i.end )), items, i => i.id),
    //             planLoading: false,
    //             planLoaded: true
    //         });
    //     }),
    //         tap((items) => ctx.dispatch(new LoadCalendarEvents(items.map(v => { return { feedId: v.calendarEventFeedId, eventId: v.calendarEventId }; })))),
    //         mergeMap((items) => ctx.dispatch(new LoadDirections(items.filter(v => null != v.directionsKey).map(v => v.directionsKey)))),
    //     );
    // }

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

    private static mapFocusDisplay(state: FocusStateModel, item: FocusItem): FocusDisplay {
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
    }

    @Selector()
    static activeFocusItems(state: FocusStateModel): FocusDisplay[] {
        return state.focusItems
            .filter(i => i.start < addHours(new Date(), 2) && new Date() < i.end)
            .sort(v => (+v.indicateTime) * -1)
            .map(item => this.mapFocusDisplay(state, item));
    }
}