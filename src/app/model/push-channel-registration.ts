export interface PushChannelRegistration {
  browserInfo: string;
  options: { [key: string]: string; };
  endpoint?: string;
  expirationTime?: number | null;
  keys?: Record<string, string>;
}
