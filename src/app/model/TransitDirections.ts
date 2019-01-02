export interface TransitDirections {
    routes: Route[];
}
export interface Route {
    steps: Step[];
    depatureTime: Date;
    arrivalTime: Date;
}
export interface Step {
    arrivalStop: Stop;
    departureStop:Stop;
    arrivalTime: Date;
    departureTime: Date;
    headsign: string;
    line: Line;
}

export interface Stop {
    location: Coordinate;
    name: string;
}

export interface Coordinate {
    lat: number;
    lng: number;
}

export interface Line {
    Name: string;
    ShortName: string;
    VehicleType: string;
}