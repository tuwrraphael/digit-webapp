import { State, Action, StateContext } from '@ngxs/store';
import { StopStore, orderStopsByDistance } from "wienerlinien-stops-indexeddb";

export class ImportPOI {
    static readonly type = "[Navigation] Import POI";
    constructor() { }
}

export class FindNearestStops {
    static readonly type = "[Navigation Find Nearest Stops]"
    constructor() { }
}

export class FindStopsByName {
    static readonly type = "[Navigation Find Stops by Name]"
    constructor(public search: string) { }
}

export interface Stop {
    name: string,
    id: string
}

export interface NavigationStateModel {
    nearestStops: Stop[]
}

@State<NavigationStateModel>({
    name: "navigationState",
    defaults: {
        nearestStops: []
    }
})
export class NavigationState {
    stopStore: StopStore;
    constructor() {
        this.stopStore = new StopStore("wienerlinienstops1");
    }

    getPosition(): Promise<Position> {
        return new Promise((res, rej) => window.navigator.geolocation.getCurrentPosition(res, rej));
    }

    @Action(ImportPOI)
    async importPOI(ctx: StateContext<NavigationStateModel>) {
        await this.stopStore.maintainDb();
    }

    @Action(FindNearestStops)
    async findNearestStops(ctx: StateContext<NavigationStateModel>) {
        let position = await this.getPosition();
        let stops = orderStopsByDistance(await this.stopStore.query(position.coords.latitude, position.coords.longitude, 500),
            position.coords.latitude, position.coords.longitude);
        const state = ctx.getState();
        ctx.setState({
            ...state,
            nearestStops: stops.map(v => { return { name: v.stop_name, id: v.stop_id } })
        });
    }

    @Action(FindNearestStops)
    async findStopsByName(ctx: StateContext<NavigationStateModel>, action: FindStopsByName) {
        let position = await this.getPosition();
        let stops = orderStopsByDistance(await this.stopStore.queryByName(action.search),
            position.coords.latitude, position.coords.longitude);
        const state = ctx.getState();
        ctx.setState({
            ...state,
            nearestStops: stops.map(v => { return { name: v.stop_name, id: v.stop_id } })
        });
    }
}