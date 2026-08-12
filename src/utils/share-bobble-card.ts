import { Asset } from 'expo-asset';
import * as Clipboard from 'expo-clipboard';
import { cacheDirectory, copyAsync } from 'expo-file-system/legacy';
import * as Linking from 'expo-linking';
import * as MediaLibrary from 'expo-media-library';
import { ImageSourcePropType } from 'react-native';
import Share, { Social } from 'react-native-share';

export type BobbleShareLinkParams = {
  cardId: string;
  bobbleId?: string;
};

export type BobbleShareContentParams = BobbleShareLinkParams & {
  cardLabel: string;
};

const BOBBLE_SHARE_ORIGIN = (
  process.env.EXPO_PUBLIC_SHARE_URL?.trim() || 'https://bobble.au'
).replace(/\/$/, '');

function isShareCancelled(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes('cancel') ||
    message.includes('dismiss') ||
    message.includes('did not share') ||
    message.includes('user denied')
  );
}

export function buildBobbleShareLink({ cardId, bobbleId }: BobbleShareLinkParams): string {
  const params = new URLSearchParams({ cardId });
  if (bobbleId) params.set('bobbleId', bobbleId);
  return `${BOBBLE_SHARE_ORIGIN}/share?${params.toString()}`;
}

export async function copyBobbleShareLink(params: BobbleShareLinkParams): Promise<string> {
  const link = buildBobbleShareLink(params);
  await Clipboard.setStringAsync(link);
  return link;
}

export async function resolveBobbleCardFileUri(
  image: ImageSourcePropType,
  filename: string
): Promise<string> {
  if (typeof image !== 'number') {
    throw new Error('Only bundled bobble cards can be shared.');
  }

  const asset = Asset.fromModule(image);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error('Could not prepare the bobble card image.');
  }

  const cacheUri = `${cacheDirectory}bobble-share-${filename}.png`;
  await copyAsync({ from: asset.localUri, to: cacheUri });
  return cacheUri;
}

export async function saveBobbleCardToPhotos(image: ImageSourcePropType): Promise<void> {
  // Write-only: avoid READ_MEDIA_IMAGES / READ_MEDIA_VIDEO (Google Play Photo & Video policy).
  const permission = await MediaLibrary.requestPermissionsAsync(true);
  if (!permission.granted) {
    throw new Error('Photo library access is required to save images.');
  }

  const localUri = await resolveBobbleCardFileUri(image, 'save');
  await MediaLibrary.saveToLibraryAsync(localUri);
}

async function openFacebookLinkShare(link: string): Promise<void> {
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
  await Linking.openURL(facebookShareUrl);
}

export async function shareBobbleCardOnFacebook(
  image: ImageSourcePropType,
  params: BobbleShareContentParams
): Promise<'facebook-app' | 'facebook-web'> {
  const link = buildBobbleShareLink(params);
  const localUri = await resolveBobbleCardFileUri(image, params.cardId);
  const message = `I just unlocked ${params.cardLabel} on Bobble! ${link}`;

  try {
    await Share.shareSingle({
      social: Social.Facebook,
      url: localUri,
      type: 'image/png',
      message,
      subject: 'My Bobble achievement',
    });

    return 'facebook-app';
  } catch (error) {
    if (isShareCancelled(error)) {
      throw error;
    }

    await openFacebookLinkShare(link);
    return 'facebook-web';
  }
}
