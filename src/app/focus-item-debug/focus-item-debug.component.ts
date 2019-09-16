import { Component, OnInit } from '@angular/core';
import { FocusDisplay, DirectionsNotFoundReason } from '../model/FocusItem';
import { addHours, addMinutes } from 'date-fns';

@Component({
  selector: 'app-focus-item-debug',
  templateUrl: './focus-item-debug.component.html',
  styleUrls: ['./focus-item-debug.component.scss']
})
export class FocusItemDebugComponent implements OnInit {

  constructor() {

  }

  focusItems: FocusDisplay[];

  ngOnInit() {
    this.focusItems = [{
      backgroundColor: "#6200ee",
      foregroundColor: "#ffffff",
      directions: {
        routes: [{
          arrivalTime: new Date(),
          depatureTime: addMinutes(new Date(), -10),
          duration: null,
          steps: [{
            line: {
              shortName: "94A",
              name: null,
              vehicleType: null,
            },
            arrivalStop: {
              location: null,
              name: null
            },
            departureStop: {
              location: null,
              name: null
            },
            arrivalTime: new Date(),
            departureTime: new Date(),
            headsign: "Kagran"
          }, {
            line: {
              shortName: "U1",
              name: null,
              vehicleType: null,
            },
            arrivalStop: {
              location: null,
              name: null
            },
            departureStop: {
              location: null,
              name: null
            },
            arrivalTime: new Date(),
            departureTime: new Date(),
            headsign: "Kagran"
          }],
        }]
      },
      directionsMetadata: {
        error: null,
        key: null,
        peferredRoute: 0
      },
      event: {
        category: null,
        end: addHours(new Date(), 2),
        start: new Date(),
        feedId: null,
        id: null,
        location: {
          text: "Pizzaria Hardeggasse",
          address: null,
          coordinate: null,
          id: null
        },
        subject: "Pizza essen",
      },
      id: "0",
      indicateTime: addMinutes(new Date(), -15),
      isEvent: true,
      isLoading: false,
      late: 0
    }, {
      backgroundColor: "#6200ee",
      foregroundColor: "#ffffff",
      directions: null,
      directionsMetadata: null,
      event: {
        category: null,
        end: addHours(new Date(), 4),
        start: addHours(new Date(), 2),
        feedId: null,
        id: null,
        location: {
          text: "Segafredo Aspernstraße",
          address: null,
          coordinate: null,
          id: null
        },
        subject: "Bier",
      },
      id: "1",
      indicateTime: addMinutes(new Date(), -15),
      isEvent: true,
      isLoading: false,
      late: 0
    },
    {
      backgroundColor: "#6200ee",
      foregroundColor: "#ffffff",
      directions: null,
      directionsMetadata: {
        error: DirectionsNotFoundReason.AddressNotFound,
        key: "",
        peferredRoute: 0
      },
      event: {
        category: null,
        end: addHours(new Date(), 4),
        start: addHours(new Date(), 2),
        feedId: null,
        id: null,
        location: {
          text: "Segafredo Aspernstraße",
          address: null,
          coordinate: null,
          id: null
        },
        subject: "Bier",
      },
      id: "2",
      indicateTime: addMinutes(new Date(), -15),
      isEvent: true,
      isLoading: false,
      late: 0
    },
    {
      backgroundColor: "#6200ee",
      foregroundColor: "#ffffff",
      directions: null,
      directionsMetadata: {
        error: DirectionsNotFoundReason.RouteNotFound,
        key: "",
        peferredRoute: 0
      },
      event: {
        category: null,
        end: addHours(new Date(), 4),
        start: addHours(new Date(), 2),
        feedId: null,
        id: null,
        location: {
          text: "Segafredo Aspernstraße",
          address: null,
          coordinate: null,
          id: null
        },
        subject: "Bier",
      },
      id: "3",
      indicateTime: addMinutes(new Date(), -15),
      isEvent: true,
      isLoading: false,
      late: 0
    }];
  }

}
