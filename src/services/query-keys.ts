export const queryKeys = {
  health: ['health'] as const,
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },
};
