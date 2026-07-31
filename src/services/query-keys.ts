export const queryKeys = {
  health: ['health'] as const,
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    list: (filter: string) => ['tasks', 'list', filter] as const,
  },
  mindMap: {
    all: ['mindMap'] as const,
    list: ['mindMap', 'list'] as const,
  },
  bobbles: {
    all: ['bobbles'] as const,
    list: (params: string) => ['bobbles', 'list', params] as const,
    detail: (id: string) => ['bobbles', 'detail', id] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: ['profile', 'me'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    preferences: ['notifications', 'preferences'] as const,
  },
};
