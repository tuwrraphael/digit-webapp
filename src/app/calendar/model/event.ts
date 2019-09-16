export interface EventData {
  subject: string;
  location: LocationData;
  start: Date;
  end: Date;
  id:string;
  feedId:string;
  category : EventCategory;
}
export interface EventCategory {
  name:string;
  foreground:string;
  background:string;
}
export interface LocationData {
  text: string;
  id: string;
  coordinate: GeoCoordinate;
  address: AddressData;
}
export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}
export interface AddressData {
  street: string;
  city: string;
  state: string;
  countryOrRegion: string;
  postalCode: string;
}
