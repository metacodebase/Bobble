export const API = {
  health: '/api/health',
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    social: '/api/auth/social',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    changePassword: '/api/auth/change-password',
  },
  tasks: {
    root: '/api/tasks',
    bulk: '/api/tasks/bulk',
    byId: (id: string) => `/api/tasks/${id}`,
    toggle: (id: string) => `/api/tasks/${id}/toggle`,
  },
  bobbles: {
    root: '/api/bobbles',
    byId: (id: string) => `/api/bobbles/${id}`,
    process: (id: string) => `/api/bobbles/${id}/process`,
    audio: (id: string) => `/api/bobbles/${id}/audio`,
    recording: (id: string) => `/api/bobbles/${id}/recording`,
  },
  profile: {
    root: '/api/profile',
    avatar: '/api/profile/avatar',
  },
} as const;
