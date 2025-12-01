export const API_ROUTES = {
  BASE: '/api',

  AUTH: {
    BASE: '/api/auth',
    LOGIN: '/api/auth/login',
  },

  USE_CASES: {
    BASE: '/api/use-cases',
    BY_ID: (id: string) => `/api/use-cases/${id}`,
  },

  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
  },
} as const;

export const APP_ROUTES = {
  HOME: '/',
  OVERVIEW: '/overview',
  USE_CASE: (id: string) => `/use-case/${id}`,
} as const;

export function getFullApiUrl(baseUrl: string, route: string): string {
  return `${baseUrl}${route}`;
}
