export const ENDPOINTS = {
  // admin endpoints
  ADMIN: {
    USERS: "/accounts/",
  },

  AUTH: {
    LOGIN: "/login/",
    REFRESH: "/refresh/",
  },

  ACCOUNT: {
    REGISTER: "/register/",
  },
} as const;
