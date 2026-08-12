const BOBBLE_HOSTS = new Set(['bobble.au', 'www.bobble.au', 'app.bobble.au']);
const CARD_ID_PATTERN = /^[a-z0-9-]{1,64}$/i;
const BOBBLE_ID_PATTERN = /^[a-f0-9]{24}$/i;

function safeShareRoute(url: URL) {
  const params = new URLSearchParams();
  const cardId = url.searchParams.get('cardId');
  const bobbleId = url.searchParams.get('bobbleId') ?? url.searchParams.get('id');
  if (cardId && CARD_ID_PATTERN.test(cardId)) params.set('cardId', cardId);
  if (bobbleId && BOBBLE_ID_PATTERN.test(bobbleId)) params.set('bobbleId', bobbleId);
  const query = params.toString();
  return query ? `/share?${query}` : '/share';
}

export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const url = new URL(path, 'bobble://app');
    const isWebLink = url.protocol === 'https:' && BOBBLE_HOSTS.has(url.hostname);
    const isAppLink = url.protocol === 'bobble:';
    if (!isWebLink && !isAppLink) return path;

    const segments = [
      isAppLink && url.hostname !== 'app' ? url.hostname : '',
      ...url.pathname.split('/'),
    ].filter(Boolean);
    const route = segments[0]?.toLowerCase();

    if (route === 'share' || route === 'achievement') return safeShareRoute(url);
    if (route === 'bobble') {
      const bobbleId = segments[1] ?? url.searchParams.get('bobbleId') ?? '';
      return BOBBLE_ID_PATTERN.test(bobbleId) ? `/bobble/${bobbleId}` : '/(tabs)/bobbles';
    }

    return path;
  } catch {
    return '/(tabs)';
  }
}
