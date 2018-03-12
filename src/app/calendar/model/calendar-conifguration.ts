import { Feed } from "./feed";

export interface CalendarConfiguration {
  changed: boolean;
  id: string;
  feeds: Feed[];
}

