export const API = {
  health: '/api/health',
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    social: '/api/auth/social',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  tasks: {
    root: '/api/tasks',
    bulk: '/api/tasks/bulk',
    byId: (id: string) => `/api/tasks/${id}`,
    toggle: (id: string) => `/api/tasks/${id}/toggle`,
  },
} as const;
