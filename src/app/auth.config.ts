import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment'
export const authConfig: AuthConfig = {
  clientId: environment.clientId,
  redirectUri: window.location.origin + '/index.html',
  postLogoutRedirectUri: window.location.origin + '/index.html',
  issuer: environment.identityUrl,
  scope: 'openid digit.user',
  oidc: true,
  requestAccessToken: true,
  requireHttps: true,
  showDebugInformation: true,
  sessionChecksEnabled: true,
}
