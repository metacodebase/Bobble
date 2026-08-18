(() => {
  const cards = new Map([
    ['brain-dump', 'Brain Dump'],
    ['brain-dump-1', 'Brain Dump'],
    ['crypto-bobble', 'Crypto Bobble'],
    ['crypto-bobble-1', 'Crypto Bobble'],
    ['reflection', 'Reflection'],
    ['reflection-1', 'Reflection'],
    ['reflection-2', 'Reflection'],
    ['reflection-3', 'Reflection'],
    ['task-bobble', 'Task Bobble'],
    ['task-bobble-1', 'Task Bobble'],
    ['task-bobble-2', 'Task Bobble'],
    ['task-bobble-3', 'Task Bobble'],
    ['workout-bobble', 'Workout Bobble'],
    ['workout-bobble-1', 'Workout Bobble'],
    ['yellowstone', 'Yellowstone'],
    ['yellowstone-1', 'Yellowstone'],
    ['idea-bobble', 'Idea Bobble'],
  ]);
  const bobbleIdPattern = /^[a-f0-9]{24}$/i;
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get('cardId');
  const bobbleId = params.get('bobbleId') ?? params.get('id');
  const hasInvalidCard = !cardId || !cards.has(cardId);
  const hasInvalidBobble = bobbleId !== null && !bobbleIdPattern.test(bobbleId);

  if (hasInvalidCard || hasInvalidBobble) {
    document.getElementById('share-view').hidden = true;
    document.getElementById('invalid-view').hidden = false;
    document.title = 'Invalid achievement link | Bobble';
    return;
  }

  const safeParams = new URLSearchParams({ cardId });
  if (bobbleId) safeParams.set('bobbleId', bobbleId);

  const cardLabel = cards.get(cardId);
  const card = document.getElementById('achievement-card');
  card.src = `./share-assets/assets/cards/${cardId}.jpg`;
  card.alt = `${cardLabel} achievement card shared from Bobble`;
  document.title = `${cardLabel} achievement | Bobble`;
  document.getElementById('open-app').href = `bobble://share?${safeParams}`;

  const userAgent = navigator.userAgent || '';
  const isAndroid = /Android/i.test(userAgent);
  const isAppleMobile = /iPhone|iPad|iPod/i.test(userAgent);
  const installLink = document.getElementById('install-app');
  const installLabel = document.getElementById('install-label');

  if (isAndroid) {
    installLink.href = 'https://play.google.com/store/apps/details?id=com.bobble.au';
    installLabel.textContent = 'Get Bobble on Google Play';
  } else if (isAppleMobile) {
    installLink.href = 'https://apps.apple.com/us/search?term=Bobble';
    installLabel.textContent = 'Find Bobble on the App Store';
  } else {
    installLink.href = 'https://play.google.com/store/apps/details?id=com.bobble.au';
    installLabel.textContent = 'Get the Bobble app';
  }
})();
