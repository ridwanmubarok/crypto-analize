const cookieKeys = {
    AUTH_TOKEN: 'auth:accessToken',
    LAST_LOGIN: 'auth:lastLogin',
    GOOGLE_AUTH_JWT: 'auth:googleAuthJwt',
    DEVICE_TYPE: 'deviceType',
  
    CLIENT_ACCESS_TOKEN: 'accessToken',
    GOOGLE_REDIRECT_URL: 'redirectUrl',
  };
  
  export type CookieValues = {
    [K in (typeof cookieKeys)[keyof typeof cookieKeys]]: string;
  };
  
  export { cookieKeys };
  