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
  bobbles: {
    all: ['bobbles'] as const,
    list: (params: string) => ['bobbles', 'list', params] as const,
    detail: (id: string) => ['bobbles', 'detail', id] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: ['profile', 'me'] as const,
  },
};
