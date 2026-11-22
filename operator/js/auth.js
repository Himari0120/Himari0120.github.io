const AUTH_STATUS = {
  NOT_CONNECTED: "AUTH_SERVER_NOT_CONNECTED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  AUTHENTICATED: "AUTHENTICATED"
};

let authStatus = AUTH_STATUS.NOT_CONNECTED;

export const initializeAuth = {
  async initialize() {
    authStatus = AUTH_STATUS.NOT_CONNECTED;

    return {
      authenticated: false,
      status: authStatus
    };
  },

  async logout() {
    authStatus = AUTH_STATUS.UNAUTHENTICATED;

    return {
      success: true,
      status: authStatus
    };
  },

  isAuthenticated() {
    return authStatus === AUTH_STATUS.AUTHENTICATED;
  },

  getStatus() {
    return authStatus;
  }
};